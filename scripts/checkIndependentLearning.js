import {config} from 'dotenv';import pg from 'pg';import assert from 'node:assert/strict';import {randomUUID} from 'node:crypto';
import {normalize} from '../server/db.js';import {createCoursesHandler} from '../api/courses.js';import {engineeringLessons} from '../server/engineering/content.js';
config({path:process.env.ACADEMY_ENV_FILE||'/private/tmp/angkor-independent-branch.env',quiet:true});
assert.ok(process.env.ACADEMY_ENV_FILE?.includes('branch'),'Use an isolated branch env file.');
const pool=new pg.Pool({connectionString:normalize(process.env.DATABASE_URL),max:3});
const student={id:'qa-independent-'+randomUUID(),name:'Synthetic learner',email:'learner@example.invalid'},other={id:'qa-independent-'+randomUUID(),name:'Other learner',email:'other@example.invalid'};const actors={student,other};
const handler=createCoursesHandler({pool:()=>pool,authenticate:async req=>actors[req.headers['x-test-actor']]});
async function call(actor,action,body,query={}){let status=200,value;const res={setHeader(){},status(n){status=n;return this;},json(v){value=v;return this;}};await handler({method:body?'POST':'GET',headers:{origin:'https://angkor-academy.vercel.app','x-test-actor':actor},query:{action,...query},body:body?{action,...body}:undefined},res);return {status,value};}
try{
 const catalog=await call('student','catalog');assert.equal(catalog.value.courses.find(c=>c.id==='engineering-ai').outline.lessonCount,48);
 await call('student','state');await call('other','state');await call('student','enroll',{courseId:'engineering-ai'});
 const first=engineeringLessons[0],second=engineeringLessons[1];assert.equal((await call('student','start',{lessonId:second.id})).status,403);
 const start=await call('student','start',{lessonId:first.id});assert.equal(start.status,200,JSON.stringify(start.value));
 assert.ok(new Date(start.value.expiresAt)-Date.now()>29*86400000,'Pauses should not be limited to a few hours');
 for(const q of start.value.questions){assert.ok(!('answer' in q));assert.ok(!('why' in q));}
 const answers=start.value.questions.map(q=>{const s=first.assessment.find(x=>x.id===q.id);return q.type==='order'?s.answer.map(i=>q.options.indexOf(s.options[i])):q.options.indexOf(s.options[s.answer]);});
 assert.equal((await call('student','draft',{id:start.value.id,answers,practical:'My own note',reflection:''})).status,200);
 assert.equal((await call('student','start',{lessonId:first.id})).value.practical,'My own note');
 assert.equal((await call('other','submit',{id:start.value.id,answers})).status,404);
 const result=await call('student','submit',{id:start.value.id,answers,practical:'',reflection:''});assert.equal(result.status,200,JSON.stringify(result.value));assert.equal(result.value.status,'approved');assert.equal(result.value.applicationPassed,true);
 assert.equal((await call('student','start',{lessonId:second.id})).status,200,'No teacher must be required');
 const duplicate=await call('student','submit',{id:start.value.id,answers:[]});assert.equal(duplicate.value.status,'approved');
 const p={largeText:true,simple:true,minutes:5,audioRate:0.7};assert.equal((await call('student','preferences',{preferences:p})).status,200);assert.equal((await call('student','preferences',{preferences:{...p,minutes:999}})).status,400);
 assert.deepEqual((await call('student','learning')).value.preferences,p);assert.equal((await call('other','learning')).value.preferences.largeText,false);
 await call('student','note',{lessonId:first.id,note:'A useful private example'});assert.equal((await call('student','learning',null,{lessonId:first.id})).value.note,'A useful private example');assert.equal((await call('other','learning',null,{lessonId:first.id})).value.note,'');
 const mem=(await pool.query('SELECT streak,due_at FROM academy.learning_reviews WHERE user_id=$1',[student.id])).rows;assert.ok(mem.length>=4);assert.ok(mem.every(m=>m.streak===1&&new Date(m.due_at)>new Date()));
 const firstDue=(await pool.query('SELECT concept,streak,due_at FROM academy.learning_reviews WHERE user_id=$1 AND lesson_id=$2 ORDER BY concept',[student.id,first.id])).rows;
 const repeat=await call('student','start',{lessonId:first.id});const repeatedAnswers=repeat.value.questions.map(q=>{const s=first.assessment.find(x=>x.id===q.id);return q.type==='order'?s.answer.map(i=>q.options.indexOf(s.options[i])):q.options.indexOf(s.options[s.answer]);});await call('student','submit',{id:repeat.value.id,answers:repeatedAnswers});
 assert.deepEqual((await pool.query('SELECT concept,streak,due_at FROM academy.learning_reviews WHERE user_id=$1 AND lesson_id=$2 ORDER BY concept',[student.id,first.id])).rows,firstDue,'An early repeat must not increase the retention interval');
 const badStart=await call('student','start',{lessonId:second.id});const incorrect=badStart.value.questions.map(q=>q.type==='order'?q.options.map((_,i)=>i):0);
 for(let i=0;i<badStart.value.questions.length;i++){const q=badStart.value.questions[i],s=second.assessment.find(x=>x.id===q.id);incorrect[i]=q.type==='order'?s.answer.map(j=>q.options.indexOf(s.options[j])):q.options.indexOf(s.options[s.answer]);}
 const critical=badStart.value.questions.findIndex(q=>q.application&&q.type!=='order');incorrect[critical]=(incorrect[critical]+1)%badStart.value.questions[critical].options.length;
 const bad=await call('student','submit',{id:badStart.value.id,answers:incorrect,practical:'x'.repeat(1000),reflection:'x'.repeat(1000)});assert.equal(bad.value.status,'reinforce','Long notes must not compensate for wrong application');
 assert.equal((await call('student','start',{lessonId:engineeringLessons[2].id})).status,403);
 const learning=await call('student','learning');assert.ok(learning.value.reviews.some(r=>r.lesson_id===second.id&&!r.remembered));
 console.log('PASS: automatic progression, practical gates, durable drafts, long pause, ownership, private notes, persisted preferences, spaced reviews, error reinforcement, idempotent submit.');
}finally{
 const ids=Object.values(actors).map(a=>a.id);
 for(const table of ['learning_reviews','learning_notes','learning_preferences','course_attempts','enrollments'])await pool.query(`DELETE FROM academy.${table} WHERE user_id=ANY($1)`,[ids]);
 await pool.query('DELETE FROM academy.learners WHERE id=ANY($1)',[ids]);await pool.end();console.log('Synthetic branch records removed.');
}
