import {config} from 'dotenv';import pg from 'pg';import fs from 'node:fs';
import {normalize} from '../server/db.js';import {lessons,levels,units} from '../server/content.js';import {publicLesson,bank,POLICY} from '../server/assessment.js';
config({path:process.env.ACADEMY_ENV_FILE||'.env.local',quiet:true});
const url=normalize(process.env.DATABASE_URL_UNPOOLED||process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL);
if(new URL(url).hostname.includes('-pooler'))throw new Error('Use a direct database connection.');
const pool=new pg.Pool({connectionString:url,max:1}),db=await pool.connect();
try{
 await db.query('BEGIN');
 const before=(await db.query('SELECT (SELECT count(*) FROM academy.attempts)::int AS attempts,(SELECT count(*) FROM academy.learning_notes)::int AS notes,(SELECT count(*) FROM academy.learners)::int AS learners')).rows[0];
 await db.query(fs.readFileSync(new URL('../migrations/004_english_sessions.sql',import.meta.url),'utf8'));
 const outline={stages:levels.map((l,i)=>({number:i+1,title:`${l.id} · ${l.name}`,goal:l.description})),lessonCount:lessons.length,units};
 await db.query("UPDATE academy.courses SET description=$1,curriculum_version=$2,outline=$3,updated_at=now() WHERE id='english'",['240 sesiones de A1 a C2: 40 por nivel, con repaso, verbos, vocabulario, pronunciación, conversación guiada, lectura y audio. Aprende paso a paso y retoma donde quedaste.',POLICY.version,JSON.stringify(outline)]);
 const offset=(await db.query("SELECT COALESCE(max(position),0)+1000 AS n FROM academy.course_lessons WHERE course_id='english'")).rows[0].n;
 await db.query("UPDATE academy.course_lessons SET position=position+$1 WHERE course_id='english'",[offset]);
 for(const [index,l] of lessons.entries())await db.query(`INSERT INTO academy.course_lessons(id,course_id,position,stage,title,body,assessment,version) VALUES($1,'english',$2,$3,$4,$5,$6,$7) ON CONFLICT(id) DO UPDATE SET position=EXCLUDED.position,stage=EXCLUDED.stage,title=EXCLUDED.title,body=EXCLUDED.body,assessment=EXCLUDED.assessment,version=EXCLUDED.version`,[l.id,index+1,levels.findIndex(x=>x.id===l.level)+1,l.title,JSON.stringify(publicLesson(l)),JSON.stringify(bank.filter(q=>q.lessonId===l.id)),POLICY.version]);
 const after=(await db.query('SELECT (SELECT count(*) FROM academy.attempts)::int AS attempts,(SELECT count(*) FROM academy.learning_notes)::int AS notes,(SELECT count(*) FROM academy.learners)::int AS learners')).rows[0];
 if(JSON.stringify(before)!==JSON.stringify(after))throw new Error('Learner data counts changed.');
 await db.query('COMMIT');console.log('Synced 240 active English sessions and 60 units. Prior attempts, learners, notes and archived introductory lessons preserved.');
}catch(e){await db.query('ROLLBACK');console.error('English sync failed:',e.code||e.name);process.exitCode=1;}finally{db.release();await pool.end();}
