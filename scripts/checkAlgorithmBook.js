import{config}from'dotenv';import pg from'pg';import assert from'node:assert/strict';import{randomUUID}from'node:crypto';import{normalize}from'../server/db.js';import{createCoursesHandler}from'../api/courses.js';
config({path:process.env.ACADEMY_ENV_FILE,quiet:true});if(!process.env.ACADEMY_ENV_FILE?.includes('branch'))throw Error('Use an isolated branch.');
const db=new pg.Pool({connectionString:normalize(process.env.DATABASE_URL),max:1});const users={a:{id:'book-test-'+randomUUID(),name:'Reader A',email:'a@example.invalid'},b:{id:'book-test-'+randomUUID(),name:'Reader B',email:'b@example.invalid'}};
const handler=createCoursesHandler({pool:()=>db,authenticate:async req=>{const user=users[req.headers['x-test-user']];if(!user)throw Object.assign(Error('Unauthorized'),{status:401});return user;}});
async function call(method,action,body={},actor){let status=200,value;const res={setHeader(){},status(s){status=s;return this;},json(v){value=v;return this;}};await handler({method,query:{action,chapter:body.chapter},body:{action,...body},headers:{origin:'https://angkor-academy.vercel.app','x-test-user':actor}},res);return{status,value};}
try{
 const book=await call('GET','book',{chapter:1});assert.equal(book.status,200);assert.equal(book.value.book.outline.chapterCount,50);assert.equal((await call('GET','book',{chapter:14})).status,404);assert.equal((await call('GET','book-progress')).status,401);
 assert.equal((await call('POST','book-progress',{chapter:1,section:'euclides',fontSize:24,userId:users.b.id},'a')).status,200);
 assert.equal((await call('GET','book-progress',{},'a')).value.point.section,'euclides');assert.equal((await call('GET','book-progress',{},'b')).value.point,null);
 assert.equal((await call('POST','book-progress',{chapter:1,section:'unpublished-section',fontSize:24},'a')).status,400);assert.equal((await call('POST','book-progress',{chapter:14,section:'intro',fontSize:24},'a')).status,404);
 assert.equal((await call('POST','book-progress',{chapter:1,section:'cierre',fontSize:18},'a')).status,200);assert.equal((await call('GET','book-progress',{},'a')).value.point.fontSize,18);
 for(const chapter of [2,3,4,5,6,7,8,9,10,11,12,13])assert.equal((await call('GET','book',{chapter})).status,200);
 assert.equal((await call('POST','book-progress',{chapter:5,section:'descenso',fontSize:24},'a')).status,200);assert.equal((await call('GET','book-progress',{},'a')).value.point.chapter,5);assert.equal((await call('GET','book-progress',{},'b')).value.point,null);
 assert.equal((await call('POST','book-progress',{chapter:2,section:'descenso',fontSize:24},'a')).status,400);
 assert.equal((await call('POST','book-progress',{chapter:13,section:'rutas',fontSize:21},'a')).status,200);assert.equal((await call('GET','book-progress',{},'a')).value.point.chapter,13);assert.equal((await call('GET','book-progress',{},'b')).value.point,null);
 const r=await db.query('SELECT count(*)::int AS n FROM academy.course_attempts WHERE user_id=ANY($1)',[Object.values(users).map(u=>u.id)]);assert.equal(r.rows[0].n,0);
 console.log('PASS: thirteen public chapters, unpublished chapter protection, chapter-specific markers, per-user persisted bookmarks and text size, no graded attempts.');
}finally{const ids=Object.values(users).map(u=>u.id);await db.query('DELETE FROM academy.reading_progress WHERE user_id=ANY($1)',[ids]);await db.query('DELETE FROM academy.learners WHERE id=ANY($1)',[ids]);await db.end();console.log('Only synthetic test records removed.');}
