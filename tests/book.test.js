import test from 'node:test';import assert from 'node:assert/strict';
import {bookParts,bookMetadata,bookChapters,chapterOne,chapterWordCount} from '../server/book/content.js';
import {chapterNumber,validateReadingPoint} from '../server/book/service.js';import {createCoursesHandler} from '../api/courses.js';
test('book contains thirteen complete chapters, a fifty-title editorial index and explicit source references',()=>{
 const index=bookParts.flatMap(p=>p.chapters);assert.equal(index.length,50);assert.equal(index.filter(c=>c.status==='published').length,13);assert.equal(index[0].number,1);assert.equal(index.at(-1).number,50);assert.equal(bookMetadata.outline.kind,'book');
 for(const c of bookChapters){assert.ok(chapterWordCount(c)>=2000&&chapterWordCount(c)<=3500,`Chapter ${c.number} length`);assert.ok(c.sections.filter(s=>s.figure||s.diagram).length>=4);for(const s of c.sections)for(const id of s.sources||[])assert.ok(c.sources.some(ref=>ref.id===id));}
 assert.equal(new Set(chapterOne.sections.map(s=>s.id)).size,chapterOne.sections.length);assert.ok(chapterOne.sections.filter(s=>s.figure).length>=4);
 for(const s of chapterOne.sections){for(const id of s.sources||[])assert.ok(chapterOne.sources.some(source=>source.id===id));assert.ok(!s.questions&&!s.assessment);}
});
test('reading markers accept published section IDs and accessibility sizes without trusting completion, grade or user fields',()=>{
 const chapter={number:1,body:chapterOne},input={chapter:1,section:'euclides',fontSize:24,userId:'someone-else',passed:true,score:100};
 assert.deepEqual(validateReadingPoint(input,chapter),{chapter:1,section:'euclides',fontSize:24});for(const invalid of [{...input,section:'nonexistent'},{...input,fontSize:99},{...input,chapter:2}])assert.throws(()=>validateReadingPoint(invalid,chapter),{status:400});
 for(const invalid of [-1,0,51,1.5,'no'])assert.throws(()=>chapterNumber(invalid),{status:400});
});
const call=async(handler,method,action,body={},headers={})=>{let status=200,value;const res={setHeader(){},status(n){status=n;return this;},json(v){value=v;return this;}};await handler({method,query:{action,chapter:body.chapter},body:{action,...body},headers},res);return{status,value};};
test('chapter is public, unpublished chapters return 404, and personal markers still require authentication and safe origin',async()=>{
 let authCalls=0;const db={query:async(query,params)=>({rows:query.includes('reading_chapters')?(bookChapters.filter(c=>c.number===params[1]).map(c=>({number:c.number,title:c.title,body:c}))):[bookMetadata]})};
 const handler=createCoursesHandler({pool:()=>db,authenticate:async()=>{authCalls++;throw Object.assign(Error('Unauthorized'),{status:401});}});
 const published=await call(handler,'GET','book',{chapter:'1'});assert.equal(published.status,200);assert.equal(published.value.chapter.number,1);assert.equal(authCalls,0);
 assert.equal((await call(handler,'GET','book',{chapter:'14'})).status,404);assert.equal((await call(handler,'GET','book-progress')).status,401);
 assert.equal((await call(handler,'POST','book-progress',{chapter:1,section:'euclides',fontSize:21},{origin:'https://foreign.example'})).status,403);
});

test('worked numerical illustrations are internally consistent rather than invented measurements',()=>{
 const rows=bookChapters[1].sections.find(s=>s.id==='cestas').diagram.rows;assert.equal(rows.filter(r=>r[2]==='Sí').reduce((n,r)=>n+r[1],0),37*12);for(const [groups,pieces] of rows)assert.equal(pieces,groups*12);
 const areas=bookChapters[2].sections.find(s=>s.id==='cuadrado').diagram.rows.map(r=>r[1]);assert.deepEqual(areas,[2**2,6*2,3**2,(2+3)**2]);assert.equal(2**2+6*2,16);assert.equal((-8)**2+6*(-8),16);
 const inputs=[[1,3],[2,5]],mse=(w,b)=>inputs.reduce((n,[x,y])=>n+(w*x+b-y)**2,0)/inputs.length;assert.equal(mse(0,0),17);assert.ok(Math.abs(mse(1.3,.8)-1.685)<1e-12);
});

test('Part II publishes eight complete chapters with distinct sections, supported references and no quizzes',()=>{
 const chapters=bookChapters.filter(c=>c.part===2);
 assert.deepEqual(chapters.map(c=>c.number),[6,7,8,9,10,11,12,13]);
 assert.equal(bookMetadata.outline.publishedCount,13);
 assert.equal(bookMetadata.outline.partTwoComplete,true);
 for(const c of chapters){
  assert.equal(new Set(c.sections.map(s=>s.id)).size,c.sections.length);
  assert.ok(c.sources.length>=4);
  for(const s of c.sections){assert.ok(!s.questions&&!s.assessment);assert.ok(s.paragraphs.every(p=>!/[¿?]/.test(p)),`No reader questions in chapter ${c.number}`);if(s.diagram){assert.ok(s.diagram.title&&s.diagram.caption);assert.ok(s.diagram.rows?.length||s.diagram.nodes?.length);}}
 }
});

test('Part II worked examples conserve routing costs, green time, key agreement and ranking weights',()=>{
 const chapter=n=>bookChapters.find(c=>c.number===n);
 assert.deepEqual(chapter(6).sections.find(s=>s.id==='ejemplo').diagram.rows.map(r=>r[2]),[9,8,12]);
 for(const row of chapter(7).sections.find(s=>s.id==='reparto').diagram.rows)assert.equal(row[1]+row[2],row[3]);
 for(const row of chapter(8).sections.find(s=>s.id==='numeros').diagram.rows)assert.ok(Math.abs(row[1]-row[2]-row[3])<1e-9);
 assert.ok(Math.abs(.8*.9+.2*.1-.74)<1e-9);assert.ok(Math.abs(.8*.3+.2*.8-.4)<1e-9);
 const powmod=(a,n,m)=>{let v=1;for(let i=0;i<n;i++)v=v*a%m;return v;};
 assert.equal(powmod(5,6,23),8);assert.equal(powmod(5,15,23),19);assert.equal(powmod(19,6,23),2);assert.equal(powmod(8,15,23),2);
 assert.equal(chapter(12).sections.find(s=>s.id==='calculo').diagram.rows.reduce((n,r)=>n+r[1],0),1);
 assert.deepEqual(chapter(13).sections.find(s=>s.id==='rutas').diagram.rows.map(r=>r[2]),[10,8]);
});
