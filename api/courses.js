import {readBook,readingProgress,saveReadingProgress} from '../server/book/service.js';
import {lessons as englishLessons} from '../server/content.js';
import {rememberFeedback,defaultPreferences,validatePreferences} from '../server/learning.js';
import { randomUUID } from 'node:crypto';
import { getPool } from '../server/db.js';
import { requireUser,safeOrigin } from '../server/auth.js';
import { prepareQuestions,safeQuestions,gradeEngineering,engineeringState } from '../server/engineering/assessment.js';
const fail=(status,message)=>{throw Object.assign(new Error(message),{status});};
const touchUser=async(db,u)=>db.query('INSERT INTO academy.learners(id,name,email) VALUES($1,$2,$3) ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,email=EXCLUDED.email,last_seen_at=now()',[u.id,u.name,u.email]);
const readLessons=async db=>(await db.query("SELECT id,position,stage,title,version FROM academy.course_lessons WHERE course_id='engineering-ai' ORDER BY position")).rows;
const readAttempts=async(db,u)=>(await db.query("SELECT id,lesson_id,version,status,started_at,submitted_at,reviewed_at,review_notes,result - 'feedback' AS result FROM academy.course_attempts WHERE user_id=$1 ORDER BY started_at DESC",[u])).rows;
const safeAttempt=a=>a?{id:a.id,questions:safeQuestions(a.questions),answers:a.answers,practical:a.practical_text||'',reflection:a.reflection_text||'',expiresAt:a.expires_at}:null;
export function createCoursesHandler({pool=getPool,authenticate=requireUser}={}){return async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Content-Type-Options','nosniff');
 let client;
 try{
  if(!['GET','POST'].includes(req.method)){res.setHeader('Allow','GET, POST');return res.status(405).json({error:'Método no permitido.'});}
  const action=req.method==='GET'?req.query?.action:req.body?.action;
  if(action==='catalog'&&req.method==='GET'){
   const db=pool();
   const {rows:courses}=await db.query('SELECT id,title,description,color,curriculum_version,outline FROM academy.courses ORDER BY id');
   const {rows:lessons}=await db.query('SELECT id,course_id,position,stage,title FROM academy.course_lessons ORDER BY position');
   return res.json({courses:courses.map(c=>({...c,lessons:lessons.filter(l=>l.course_id===c.id&&(c.id!=='english'||englishLessons.some(e=>e.id===l.id)))}))});
  }
  if(action==='book'&&req.method==='GET')return res.json(await readBook(pool(),req.query.chapter));
  if(req.method==='POST'&&!safeOrigin(req))fail(403,'Origen no permitido.');
  const user=await authenticate(req);const db=pool();await touchUser(db,user);
  if(action==='book-progress')return res.json(req.method==='GET'?{point:await readingProgress(db,user.id)}:await saveReadingProgress(db,user.id,req.body));
  if(action==='state'&&req.method==='GET'){
   const lessons=await readLessons(db),attempts=await readAttempts(db,user.id);
   const memberships=(await db.query('SELECT course_id FROM academy.enrollments WHERE user_id=$1',[user.id])).rows.map(r=>r.course_id);
   const staff=false;
   const statuses=engineeringState(lessons,attempts);
   const english=(await db.query('SELECT count(DISTINCT lesson_id)::int AS completed FROM academy.attempts WHERE user_id=$1 AND kind=\'practice\' AND passed=true AND lesson_id=ANY($2)',[user.id,englishLessons.map(l=>l.id)])).rows[0].completed;
   return res.json({user,staff,enrolled:memberships,lessons:statuses,englishCompleted:english,stats:{attempts:attempts.filter(a=>a.submitted_at).length,approved:statuses.filter(l=>l.approved).length,pending:statuses.filter(l=>l.status==='reinforce').length},history:attempts.filter(a=>a.submitted_at).slice(0,40).map(({result,...a})=>({...a,percent:result?.percent,reinforce:result?.reinforce||[]}))});
  }
  if(action==='enroll'&&req.method==='POST'){
   if(!['english','engineering-ai'].includes(req.body.courseId))fail(400,'Curso no válido.');
   await db.query('INSERT INTO academy.enrollments(user_id,course_id) VALUES($1,$2) ON CONFLICT(user_id,course_id) DO UPDATE SET last_seen_at=now()',[user.id,req.body.courseId]);
   return res.json({success:true});
  }
  if(action==='lesson'&&req.method==='GET'){
   const lessons=await readLessons(db),attempts=await readAttempts(db,user.id);
   const lessonId=req.query.id;
   if(!engineeringState(lessons,attempts).find(l=>l.id===lessonId)?.accessible)fail(403,'Completa la comprobación automática de la sesión anterior para continuar.');
   const lesson=(await db.query("SELECT id,position,stage,title,body,version FROM academy.course_lessons WHERE id=$1 AND course_id='engineering-ai'",[lessonId])).rows[0];
   if(!lesson)fail(404,'Sesión no encontrada.');
   const course=(await db.query("SELECT news FROM academy.courses WHERE id='engineering-ai'")).rows[0];
   const pending=(await db.query("SELECT * FROM academy.course_attempts WHERE user_id=$1 AND lesson_id=$2 AND version=$3 AND status='draft' AND expires_at>now()",[user.id,lesson.id,lesson.version])).rows[0];
   const previous=attempts.find(a=>a.lesson_id===lesson.id&&a.submitted_at);
   return res.json({lesson,news:course.news,reinforce:previous?.result?.reinforce||[],reviewNotes:previous?.review_notes||'',previousResult:previous?.result||null,pending:safeAttempt(pending)});
  }
  if(action==='learning'&&req.method==='GET'){
   const preferences=(await db.query('SELECT preferences FROM academy.learning_preferences WHERE user_id=$1',[user.id])).rows[0]?.preferences||defaultPreferences;
   const reviews=(await db.query(`SELECT r.course_id,r.lesson_id,l.title,bool_and(r.last_correct) AS remembered,min(r.due_at) AS due_at,array_agg(r.concept ORDER BY r.concept) AS concepts FROM academy.learning_reviews r JOIN academy.course_lessons l ON l.id=r.lesson_id WHERE r.user_id=$1 AND ($2::text IS NULL OR r.course_id=$2) AND r.due_at<=now() GROUP BY r.course_id,r.lesson_id,l.title ORDER BY bool_and(r.last_correct),min(r.due_at) LIMIT 20`,[user.id,['english','engineering-ai'].includes(req.query.courseId)?req.query.courseId:null])).rows;
   const note=typeof req.query.lessonId==='string'?(await db.query('SELECT note FROM academy.learning_notes WHERE user_id=$1 AND lesson_id=$2',[user.id,req.query.lessonId])).rows[0]?.note||'':'';
   return res.json({preferences,reviews,note});
  }
  if(action==='preferences'&&req.method==='POST'){
   const value=validatePreferences(req.body.preferences);
   await db.query('INSERT INTO academy.learning_preferences(user_id,preferences) VALUES($1,$2) ON CONFLICT(user_id) DO UPDATE SET preferences=EXCLUDED.preferences,updated_at=now()',[user.id,JSON.stringify(value)]);
   return res.json({preferences:value});
  }
  if(action==='note'&&req.method==='POST'){
   if(typeof req.body.lessonId!=='string'||typeof req.body.note!=='string'||req.body.note.length>16000)fail(400,'Nota no válida.');
   if(!(await db.query('SELECT 1 FROM academy.course_lessons WHERE id=$1',[req.body.lessonId])).rowCount)fail(404,'Lección no encontrada.');
   await db.query('INSERT INTO academy.learning_notes(user_id,lesson_id,note) VALUES($1,$2,$3) ON CONFLICT(user_id,lesson_id) DO UPDATE SET note=EXCLUDED.note,updated_at=now()',[user.id,req.body.lessonId,req.body.note]);
   return res.json({saved:true});
  }
  if(!['start','draft','submit'].includes(action)||req.method!=='POST')fail(400,'Acción no válida.');
  client=await db.connect();await client.query('BEGIN');
  await client.query('SELECT id FROM academy.learners WHERE id=$1 FOR UPDATE',[user.id]);
  if(action==='start'){
   const lessons=await readLessons(client),attempts=await readAttempts(client,user.id);
   const id=req.body.lessonId;
   if(!engineeringState(lessons,attempts).find(l=>l.id===id)?.accessible)fail(403,'Primero completa la comprobación automática de la sesión anterior.');
   if(!(await client.query("SELECT 1 FROM academy.enrollments WHERE user_id=$1 AND course_id='engineering-ai'",[user.id])).rowCount)fail(403,'Inscríbete en este curso antes de practicar.');
   const lesson=(await client.query("SELECT version,assessment FROM academy.course_lessons WHERE id=$1 AND course_id='engineering-ai'",[id])).rows[0];
   if(!lesson)fail(404,'Sesión no encontrada.');
   const existing=(await client.query("SELECT * FROM academy.course_attempts WHERE user_id=$1 AND lesson_id=$2 AND status='draft' FOR UPDATE",[user.id,id])).rows[0];
   if(existing&&existing.version===lesson.version&&new Date(existing.expires_at)>new Date()){await client.query('COMMIT');return res.json(safeAttempt(existing));}
   if(existing)await client.query("UPDATE academy.course_attempts SET status='reinforce',result=$2 WHERE id=$1",[existing.id,JSON.stringify({expired:true,reinforce:['Retomar un intento nuevo']})]);
   const attemptId=randomUUID(),questions=prepareQuestions(lesson.assessment);
   const row=(await client.query('INSERT INTO academy.course_attempts(id,user_id,lesson_id,version,questions) VALUES($1,$2,$3,$4,$5) RETURNING *',[attemptId,user.id,id,lesson.version,JSON.stringify(questions)])).rows[0];
   await client.query('COMMIT');return res.json(safeAttempt(row));
  }
  if(typeof req.body.id!=='string'||!/^[a-f0-9-]{36}$/i.test(req.body.id))fail(400,'Intento no válido.');
  const attempt=(await client.query('SELECT * FROM academy.course_attempts WHERE id=$1 FOR UPDATE',[req.body.id])).rows[0];
  if(!attempt)fail(404,'Intento no encontrado.');
  if(attempt.user_id!==user.id)fail(404,'Intento no encontrado.');
  if(attempt.status!=='draft'){
   if(action==='submit'){await client.query('COMMIT');return res.json({...attempt.result,status:attempt.status});}
   fail(409,'Este intento ya se envió.');
  }
  if(new Date(attempt.expires_at)<new Date())fail(410,'El intento venció. Abre una evaluación nueva.');
  const current=(await client.query('SELECT version FROM academy.course_lessons WHERE id=$1',[attempt.lesson_id])).rows[0];
  if(current.version!==attempt.version)fail(410,'La sesión se actualizó. Abre un intento nuevo.');
  const practical=req.body.practical||'',reflection=req.body.reflection||'';
  if(typeof practical!=='string'||practical.length>16000||typeof reflection!=='string'||reflection.length>8000)fail(400,'El texto supera el tamaño permitido.');
  if(action==='draft'){
   if(!Array.isArray(req.body.answers)||req.body.answers.length!==attempt.questions.length||req.body.answers.some((v,i)=>v!==null&&(attempt.questions[i].type==='order'?(!Array.isArray(v)||v.length>20||v.some(x=>!Number.isInteger(x))):!Number.isInteger(v))))fail(400,'Borrador no válido.');
   await client.query('UPDATE academy.course_attempts SET answers=$1,practical_text=$2,reflection_text=$3 WHERE id=$4',[JSON.stringify(req.body.answers),practical,reflection,attempt.id]);
   await client.query('COMMIT');return res.json({saved:true});
  }
  // Open notes are saved as a notebook; objective tasks determine progression.
  const result=gradeEngineering(attempt.questions,req.body.answers),status=result.quizPassed?'approved':'reinforce';
  await client.query('UPDATE academy.course_attempts SET answers=$1,practical_text=$2,reflection_text=$3,result=$4,status=$5,submitted_at=now() WHERE id=$6',[JSON.stringify(req.body.answers),practical.trim(),reflection.trim(),JSON.stringify(result),status,attempt.id]);
  await rememberFeedback(client,user.id,'engineering-ai',attempt.lesson_id,result.feedback);
  await client.query('COMMIT');return res.json({...result,status});
 }catch(error){if(client)await client.query('ROLLBACK');if(!error.status)console.error('Course request failed',{code:error.code||error.name});return res.status(error.status||503).json({error:error.status?error.message:'No pudimos conectar con los cursos. Intenta de nuevo.'});}
 finally{client?.release();}
};}
export default createCoursesHandler();
