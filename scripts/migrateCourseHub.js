import { config } from 'dotenv';
import fs from 'node:fs';
import pg from 'pg';
import { normalize } from '../server/db.js';
import { engineeringCourse,engineeringLessons,technologyNews } from '../server/engineering/content.js';
import { lessons,levels,units } from '../server/content.js';
import { publicLesson,bank,POLICY } from '../server/assessment.js';
config({path:process.env.ACADEMY_ENV_FILE||'.env.local',quiet:true});
const direct=normalize(process.env.DATABASE_URL_UNPOOLED||process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL);
if(new URL(direct).hostname.includes('-pooler'))throw new Error('Migrations require a direct connection.');
const pool=new pg.Pool({connectionString:normalize(process.env.DATABASE_URL_UNPOOLED||process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL),max:1,connectionTimeoutMillis:10000});
const client=await pool.connect();
try{
 await client.query('BEGIN');
 await client.query(fs.readFileSync(new URL('../migrations/002_course_hub.sql',import.meta.url),'utf8'));
 await client.query(fs.readFileSync(new URL('../migrations/003_independent_learning.sql',import.meta.url),'utf8'));
 const english={id:'english',title:'Inglés, de A1 a C2',description:'Una ruta de inglés con 40 lecciones de A1, audios y ejercicios. A2–C2 conservan material introductorio.',color:'purple',version:POLICY.version,stages:levels.map((l,i)=>({number:i+1,title:l.id+' · '+l.name,goal:l.description})),lessonCount:lessons.length,units};
 for(const course of [english,engineeringCourse])await client.query('INSERT INTO academy.courses(id,title,description,color,curriculum_version,outline,news) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(id) DO UPDATE SET title=EXCLUDED.title,description=EXCLUDED.description,color=EXCLUDED.color,curriculum_version=EXCLUDED.curriculum_version,outline=EXCLUDED.outline,news=EXCLUDED.news,updated_at=now()',[course.id,course.title,course.description,course.color,course.version,JSON.stringify({stages:course.stages,lessonCount:course.lessonCount,units:course.units}),JSON.stringify(course.id==='engineering-ai'?technologyNews:[])]);
 const all=[...lessons.map((l,i)=>({id:l.id,course:'english',position:i+1,stage:levels.findIndex(x=>x.id===l.level)+1,title:l.title,body:publicLesson(l),assessment:bank.filter(q=>q.lessonId===l.id),version:POLICY.version})),...engineeringLessons.map(l=>({...l,course:'engineering-ai',version:engineeringCourse.version}))];
 await client.query("UPDATE academy.course_lessons SET position=position+10000 WHERE course_id='engineering-ai'");
 for(const l of all)await client.query('INSERT INTO academy.course_lessons(id,course_id,position,stage,title,body,assessment,version) VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT(id) DO UPDATE SET title=EXCLUDED.title,body=EXCLUDED.body,assessment=EXCLUDED.assessment,version=EXCLUDED.version,stage=EXCLUDED.stage,position=EXCLUDED.position',[l.id,l.course,l.position,l.stage,l.title,JSON.stringify(l.body),JSON.stringify(l.assessment),l.version]);
 if(process.env.ACADEMY_OWNER_EMAIL){const r=await client.query('INSERT INTO academy.staff(user_id) SELECT id FROM academy.learners WHERE lower(email)=lower($1) ON CONFLICT DO NOTHING RETURNING user_id',[process.env.ACADEMY_OWNER_EMAIL]);console.log('Instructor owner initialized:',r.rowCount===1?'yes':'already present or owner not registered');}
 await client.query('COMMIT');console.log('Course hub ready: 2 courses, independent assessment, spaced review and learning preferences.');
}catch(e){await client.query('ROLLBACK');console.error('Migration failed:',e.code||e.name);process.exitCode=1;}finally{client.release();await pool.end();}
