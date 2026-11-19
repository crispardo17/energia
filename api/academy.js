import {validateWorkshop} from '../server/english-workshop.js';
import {rememberFeedback} from '../server/learning.js';
import { randomUUID } from 'node:crypto';
import { sql } from 'drizzle-orm';
import { database, getPool, normalize } from '../server/db.js';
import { requireUser, safeOrigin } from '../server/auth.js';
import { levels, lessons, units } from '../server/content.js';
import { POLICY, SKILLS, publicLesson, levelState, assertAccess, createQuestions, publicQuestions, grade, validAnswer } from '../server/assessment.js';
import '../server/exams.js';

export default async function handler(req,res) {
 res.setHeader('Cache-Control','private, no-store');
 res.setHeader('X-Content-Type-Options','nosniff');
 try {
  if(!['GET','POST'].includes(req.method)) {res.setHeader('Allow','GET, POST');return res.status(405).json({error:'Método no permitido.'});}
  const action=req.method==='GET' ? req.query?.action : req.body?.action;
  if(action==='catalog'&&req.method==='GET') return res.json({levels,units,lessons:lessons.map(publicLesson),policy:POLICY,skills:SKILLS,authUrl:normalize(process.env.NEON_AUTH_BASE_URL)});
  if(req.method==='POST'&&!safeOrigin(req)) return res.status(403).json({error:'Origen no permitido.'});
  const user=await requireUser(req);
  const db=database();
  await db.execute(sql`INSERT INTO academy.learners(id,name,email) VALUES(${user.id},${user.name},${user.email}) ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,email=EXCLUDED.email,last_seen_at=now()`);
  if(action==='workshop') {
   const lessonId=req.method==='GET'?req.query?.lessonId:req.body?.lessonId;
   const target=lessons.find(l=>l.id===lessonId);
   if(!target)return res.status(404).json({error:'Lección no encontrada.'});
   const prior=(await getPool().query('SELECT level,lesson_id,kind,passed,policy_version,submitted_at FROM academy.attempts WHERE user_id=$1 AND submitted_at IS NOT NULL',[user.id])).rows;
   assertAccess({kind:'practice',lessonId},prior);
   if(req.method==='GET')return res.json({state:(await getPool().query('SELECT state FROM academy.english_session_work WHERE user_id=$1 AND lesson_id=$2',[user.id,lessonId])).rows[0]?.state||null});
   const state=validateWorkshop(req.body.state);
   await getPool().query('INSERT INTO academy.english_session_work(user_id,lesson_id,state) VALUES($1,$2,$3) ON CONFLICT(user_id,lesson_id) DO UPDATE SET state=EXCLUDED.state,updated_at=now()',[user.id,lessonId,JSON.stringify(state)]);
   return res.json({saved:true});
  }
  if(action==='progress'&&req.method==='GET') {
   const {rows:attempts}=await db.execute(sql`SELECT id,level,lesson_id,kind,policy_version,passed,started_at,submitted_at,result FROM academy.attempts WHERE user_id=${user.id} AND submitted_at IS NOT NULL ORDER BY started_at DESC`);
   const skills={};
   for(const attempt of attempts) for(const [key,value] of Object.entries(attempt.result?.skills||{})) {
    skills[key]??={correct:0,total:0};skills[key].correct+=value.correct;skills[key].total+=value.total;
   }
   for(const value of Object.values(skills))value.percent=Math.round(value.correct/value.total*100);
   const knowledge=lessons.map(l=>{const last=attempts.find(a=>a.kind==='practice'&&a.lesson_id===l.id);return {lessonId:l.id,title:l.title,level:l.level,status:!last?'pending':last.passed?'mastered':'reinforce'};});
   const latestWork=(await getPool().query('SELECT lesson_id,state,updated_at FROM academy.english_session_work WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 1',[user.id])).rows[0]||null;
   const practiceSeconds=attempts.reduce((total,a)=>total+Math.max(0,Math.min(7200,(new Date(a.submitted_at)-new Date(a.started_at))/1000)),0);
   return res.json({user,knowledge,latestWork,levels:levelState(attempts),stats:{attempts:attempts.length,practiceMinutes:Math.round(practiceSeconds/60),activeDays:new Set(attempts.map(a=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bogota'}).format(new Date(a.submitted_at)))).size,skills},history:attempts.slice(0,30).map(({result,...a})=>({...a,percent:result?.percent,total:result?.total,correct:result?.correct})),policy:POLICY});
  }
  if(action==='start'&&req.method==='POST') {
   const client=await getPool().connect();
   try {
    await client.query('BEGIN');
    // Serialize starts and submissions per learner, including across server instances.
    await client.query('SELECT id FROM academy.learners WHERE id=$1 FOR UPDATE',[user.id]);
    const {rows:attempts}=await client.query('SELECT * FROM academy.attempts WHERE user_id=$1 AND submitted_at IS NOT NULL',[user.id]);
    const config={kind:req.body.kind,lessonId:req.body.lessonId,level:req.body.level};
    const access=assertAccess(config,attempts);
    const {rows:pending}=await client.query('SELECT * FROM academy.attempts WHERE user_id=$1 AND submitted_at IS NULL AND kind=$2 AND lesson_id IS NOT DISTINCT FROM $3 AND level=$4',[user.id,config.kind,access.lessonId,access.level]);
    const existing=pending[0];
    if(existing && existing.policy_version===POLICY.version && new Date(existing.expires_at)>new Date() && existing.kind===config.kind && existing.lesson_id===access.lessonId && existing.level===access.level) {
     await client.query('COMMIT');
     return res.json({id:existing.id,kind:existing.kind,level:existing.level,questions:publicQuestions(existing.questions),answers:existing.answers,expiresAt:existing.expires_at});
    }
    if(existing) await client.query('DELETE FROM academy.attempts WHERE id=$1 AND user_id=$2 AND submitted_at IS NULL',[existing.id,user.id]);
    const questions=createQuestions({...config,...access}),id=randomUUID();
    const {rows}=await client.query('INSERT INTO academy.attempts(id,user_id,level,lesson_id,kind,policy_version,questions) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING expires_at',[id,user.id,access.level,access.lessonId,config.kind,POLICY.version,JSON.stringify(questions)]);
    await client.query('COMMIT');
    return res.json({id,kind:config.kind,level:access.level,questions:publicQuestions(questions),expiresAt:rows[0].expires_at});
   } catch(e) {await client.query('ROLLBACK');throw e;} finally {client.release();}
  }
  if(['submit','draft'].includes(action)&&req.method==='POST') {
   if(typeof req.body.id!=='string'||!/^[a-f0-9-]{36}$/i.test(req.body.id)) return res.status(400).json({error:'Intento inválido.'});
   const client=await getPool().connect();
   try {
    await client.query('BEGIN');
    await client.query('SELECT id FROM academy.learners WHERE id=$1 FOR UPDATE',[user.id]);
    const {rows}=await client.query('SELECT * FROM academy.attempts WHERE id=$1 AND user_id=$2 FOR UPDATE',[req.body.id,user.id]);
    const a=rows[0];
    if(!a) throw Object.assign(new Error('Intento no encontrado.'),{status:404});
    if(a.submitted_at){if(action==='draft')throw Object.assign(new Error('El intento ya fue enviado.'),{status:409});await client.query('COMMIT');return res.json(a.result);}
    if(a.policy_version!==POLICY.version) throw Object.assign(new Error('Esta práctica se actualizó. Comienza un intento nuevo.'),{status:410});
    if(new Date(a.expires_at)<new Date()) throw Object.assign(new Error('El intento venció. Comienza uno nuevo.'),{status:410});
    const {rows:prior}=await client.query('SELECT * FROM academy.attempts WHERE user_id=$1 AND submitted_at IS NOT NULL',[user.id]);
    assertAccess({kind:a.kind,lessonId:a.lesson_id,level:a.level},prior);
    if(action==='draft'){
     if(!Array.isArray(req.body.answers)||req.body.answers.length!==a.questions.length||req.body.answers.some((v,i)=>!validAnswer(a.questions[i],v,true)))throw Object.assign(new Error('Borrador no válido.'),{status:400});
     await client.query("UPDATE academy.attempts SET answers=$1,expires_at=now()+interval '30 days' WHERE id=$2 AND user_id=$3",[JSON.stringify(req.body.answers),a.id,user.id]);
     await client.query('COMMIT');return res.json({saved:true});
    }
    const result=grade(a.questions,req.body.answers,a.kind);
    await client.query('UPDATE academy.attempts SET answers=$1,result=$2,passed=$3,submitted_at=now() WHERE id=$4 AND user_id=$5',[JSON.stringify(req.body.answers),JSON.stringify(result),result.passed,a.id,user.id]);
    await rememberFeedback(client,user.id,'english',a.lesson_id,result.feedback);
    await client.query('COMMIT');
    return res.json(result);
   } catch(e) {await client.query('ROLLBACK');throw e;} finally {client.release();}
  }
  return res.status(400).json({error:'Acción no válida.'});
 } catch(error) {
  if(!error.status) console.error('Academy request failed',{code:error.code||error.name});
  return res.status(error.status||503).json({error:error.status?error.message:'No pudimos conectar con tu aprendizaje. Intenta de nuevo en unos momentos.'});
 }
}
