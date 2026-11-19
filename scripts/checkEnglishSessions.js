import {config} from 'dotenv';import pg from 'pg';import assert from 'node:assert/strict';import {randomUUID} from 'node:crypto';import {normalize} from '../server/db.js';import {validateWorkshop} from '../server/english-workshop.js';import {createQuestions,grade} from '../server/assessment.js';
config({path:process.env.ACADEMY_ENV_FILE,quiet:true});if(!process.env.ACADEMY_ENV_FILE?.includes('branch'))throw Error('Use a test branch.');
const pool=new pg.Pool({connectionString:normalize(process.env.DATABASE_URL),max:1}),db=await pool.connect();
try{await db.query('BEGIN');const id='english-check-'+randomUUID(),other='english-check-'+randomUUID();await db.query('INSERT INTO academy.learners(id,name,email) VALUES($1,$3,$4),($2,$3,$4)',[id,other,'Synthetic learner','test@example.invalid']);
 const state=validateWorkshop({part:5,conversation:['I would check the evidence.','',''],writing:'I am ready.'});
 await db.query('INSERT INTO academy.english_session_work(user_id,lesson_id,state) VALUES($1,$2,$3)',[id,'a1-u01-l1',JSON.stringify(state)]);
 assert.deepEqual((await db.query('SELECT state FROM academy.english_session_work WHERE user_id=$1 AND lesson_id=$2',[id,'a1-u01-l1'])).rows[0].state,state);assert.equal((await db.query('SELECT state FROM academy.english_session_work WHERE user_id=$1',[other])).rowCount,0);
 const qs=createQuestions({kind:'practice',lessonId:'a2-u01-l1'}),answers=qs.map(q=>q.type==='text'?q.accepted[0]:q.answer),result=grade(qs,answers,'practice');assert.equal(result.passed,true);
 const attempt=randomUUID();await db.query("INSERT INTO academy.attempts(id,user_id,level,lesson_id,kind,policy_version,questions,answers,result,passed,submitted_at) VALUES($1,$2,'A2','a2-u01-l1','practice','test',$3,$4,$5,true,now())",[attempt,id,JSON.stringify(qs),JSON.stringify(answers),JSON.stringify(result)]);
 const saved=(await db.query('SELECT answers,result FROM academy.attempts WHERE id=$1 AND user_id=$2',[attempt,id])).rows[0];assert.ok(saved.answers.some(a=>typeof a==='string'));assert.equal(saved.result.percent,100);
 assert.equal((await db.query("SELECT count(*)::int AS n FROM academy.course_lessons WHERE course_id='english' AND version='2026-11-18-english-v3'")).rows[0].n,240);
 assert.ok((await db.query("SELECT relrowsecurity FROM pg_class WHERE oid='academy.english_session_work'::regclass")).rows[0].relrowsecurity);
 console.log('PASS: 240 persisted sessions; private resumable work; written answers/results round-trip; row security enabled.');
}finally{await db.query('ROLLBACK');db.release();await pool.end();console.log('Synthetic records rolled back.');}
