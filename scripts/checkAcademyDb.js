import { config } from 'dotenv';
import pg from 'pg';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { normalize } from '../server/db.js';
import { createQuestions,grade } from '../server/assessment.js';
import '../server/exams.js';
config({path:process.env.ACADEMY_ENV_FILE||'.env.local',quiet:true});
const pool=new pg.Pool({connectionString:normalize(process.env.DATABASE_URL),max:1});
const client=await pool.connect();
try {
 await client.query('BEGIN');
 const user='integration-'+randomUUID(),other='integration-'+randomUUID(),id=randomUUID();
 await client.query('INSERT INTO academy.learners(id,name,email) VALUES($1,$2,$3),($4,$2,$3)',[user,'Integration test','test@example.invalid',other]);
 const qs=createQuestions({kind:'practice',lessonId:'a1-u01-l1'});
 await client.query('INSERT INTO academy.attempts(id,user_id,level,lesson_id,kind,policy_version,questions) VALUES($1,$2,$3,$4,$5,$6,$7)',[id,user,'A1','a1-u01-l1','practice','test',JSON.stringify(qs)]);
 const {rows}=await client.query('SELECT * FROM academy.attempts WHERE id=$1 AND user_id=$2',[id,user]);
 assert.equal(rows.length,1);assert.equal(rows[0].questions.length,8);
 const inaccessible=await client.query('SELECT * FROM academy.attempts WHERE id=$1 AND user_id=$2',[id,other]);assert.equal(inaccessible.rowCount,0);
 const result=grade(rows[0].questions,rows[0].questions.map(q=>q.type==='text'?q.accepted[0]:q.answer),'practice');
 await client.query('UPDATE academy.attempts SET result=$1,passed=$2,submitted_at=now() WHERE id=$3',[JSON.stringify(result),result.passed,id]);
 const saved=await client.query('SELECT result,passed FROM academy.attempts WHERE id=$1',[id]);assert.equal(saved.rows[0].result.percent,100);assert.equal(saved.rows[0].passed,true);
 console.log('Database integration passed: attempt serialization, server grading, user filtering and persistent results.');
} finally {await client.query('ROLLBACK');client.release();await pool.end();console.log('All test records rolled back.');}
