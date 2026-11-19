import {config} from 'dotenv';import pg from 'pg';import fs from 'node:fs';
import {normalize} from '../server/db.js';import {bookMetadata,bookChapters,chapterWordCount,BOOK_VERSION} from '../server/book/content.js';
config({path:process.env.ACADEMY_ENV_FILE||'.env.local',quiet:true});
const url=normalize(process.env.DATABASE_URL_UNPOOLED||process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL);if(new URL(url).hostname.includes('-pooler'))throw Error('Use a direct database connection.');
const pool=new pg.Pool({connectionString:url,max:1}),db=await pool.connect();
try{await db.query('BEGIN');await db.query(fs.readFileSync(new URL('../migrations/005_algorithm_book.sql',import.meta.url),'utf8'));
 await db.query(`INSERT INTO academy.courses(id,title,description,color,curriculum_version,outline) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(id) DO UPDATE SET title=EXCLUDED.title,description=EXCLUDED.description,color=EXCLUDED.color,curriculum_version=EXCLUDED.curriculum_version,outline=EXCLUDED.outline,updated_at=now()`,[bookMetadata.id,bookMetadata.title,bookMetadata.description,bookMetadata.color,BOOK_VERSION,JSON.stringify(bookMetadata.outline)]);
 for(const chapter of bookChapters)await db.query(`INSERT INTO academy.reading_chapters(course_id,number,title,body,published,version) VALUES($1,$2,$3,$4,true,$5) ON CONFLICT(course_id,number) DO UPDATE SET title=EXCLUDED.title,body=EXCLUDED.body,published=true,version=EXCLUDED.version,updated_at=now()`,[bookMetadata.id,chapter.number,chapter.title,JSON.stringify(chapter),BOOK_VERSION]);
 await db.query('COMMIT');console.log(`Book published: Parts I and II, ${bookChapters.length} chapters (${bookChapters.map(c=>chapterWordCount(c)).join(" / ")} words), 50-entry editorial index, no assessments. Existing courses and learner work unchanged.`);
}catch(e){await db.query('ROLLBACK');console.error('Book sync failed:',e.code||e.name);process.exitCode=1;}finally{db.release();await pool.end();}
