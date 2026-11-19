import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync,existsSync } from 'node:fs';
import { bank,examBank,POLICY,levelState,assertAccess,createQuestions,publicQuestions,grade } from '../server/assessment.js';
import '../server/exams.js';
import { a1Lessons, a1Units } from '../server/a1-curriculum.js';
import { requireUser, safeOrigin } from '../server/auth.js';
import handler from '../api/academy.js';
const now=Date.parse('2026-11-18T12:00:00Z');
const practice=id=>({policy_version:POLICY.version,level:'A1',kind:'practice',lesson_id:id,passed:true,submitted_at:new Date(now-48*3600000).toISOString()});
const initial=a1Lessons.map(l=>practice(l.id));
test('server denies jumping levels even with a forged request',()=>{
 assert.throws(()=>assertAccess({kind:'practice',lessonId:'a2-u01-l1'},[]),{status:403});
 assert.throws(()=>assertAccess({kind:'exam',level:'A2'},[]),{status:403});
 assert.throws(()=>assertAccess({kind:'exam',level:'A1'},[]),{status:403});
 assert.deepEqual(assertAccess({kind:'exam',level:'A1'},initial),{level:'A1',lessonId:null});
});
test('a perfect exam alone cannot unlock the next level; retention requires 24h',()=>{
 const exam={policy_version:POLICY.version,level:'A1',kind:'exam',passed:true,submitted_at:new Date(now).toISOString()};
 const attempts=[...initial,exam];
 assert.equal(levelState(attempts,now)[1].accessible,false);
 assert.throws(()=>assertAccess({kind:'review',level:'A1'},attempts,now+23*3600000),{status:403});
 assert.equal(assertAccess({kind:'review',level:'A1'},attempts,now+24*3600000).level,'A1');
 const premature={policy_version:POLICY.version,level:'A1',kind:'review',passed:true,submitted_at:new Date(now+3600000).toISOString()};
 assert.equal(levelState([...attempts,premature],now+25*3600000)[1].accessible,false);
 const review={...premature,submitted_at:new Date(now+24*3600000).toISOString()};
 assert.equal(levelState([...attempts,review],now+25*3600000)[1].accessible,true);
 assert.equal(levelState([...attempts,review],now+25*3600000)[2].accessible,false);
});
test('minimum per skill prevents high global score from hiding a weak skill',()=>{
 const qs=Array.from({length:20},(_,i)=>({id:String(i),skill:i<2?'listening':'grammar',options:['a','b'],answer:0}));
 const result=grade(qs,qs.map((_,i)=>i<2?1:0),'exam');
 assert.equal(result.percent,90);assert.equal(result.passed,false);
 assert.equal(grade(qs,qs.map(()=>0),'exam').passed,true);
 assert.throws(()=>grade(qs,[0],'exam'),{status:400});
 assert.throws(()=>grade(qs,qs.map(()=>9),'exam'),{status:400});
});
test('shuffling preserves answers; public attempts never disclose answers or transcripts',()=>{
 for(let i=0;i<10;i++){
  const qs=createQuestions({kind:'practice',lessonId:a1Lessons[0].id});
  assert.equal(grade(qs,qs.map(q=>q.type==='text'?q.accepted[0]:q.answer),'practice').passed,true);
  for(const q of publicQuestions(qs))for(const hidden of ['answer','why','transcript','accepted','model'])assert.equal(hidden in q,false);
 }
});
test('all levels have independent assessment and review forms and actual audio files',()=>{
 const ids=new Set();
 for(const q of [...bank,...examBank]){assert.ok(!ids.has(q.id));ids.add(q.id);assert.ok(q.type==='text'?q.accepted.length:q.options[q.answer]);if(q.audio){assert.ok(existsSync('public'+q.audio));assert.ok(readFileSync('public'+q.audio).length>1000);}}
 for(const level of ['A1','A2','B1','B2','C1','C2']){
  const exam=createQuestions({kind:'exam',level}),review=createQuestions({kind:'review',level});
  assert.equal(exam.length,40);assert.equal(new Set(exam.map(q=>q.skill)).size,4);
  assert.ok(review.every(q=>!exam.some(e=>e.id===q.id)));
  assert.notEqual(exam.find(q=>q.audio).audio,review.find(q=>q.audio).audio);
 }
});
test('failed assessments require a pause before retaking',()=>{
 const attempts=[...initial,{policy_version:POLICY.version,level:'A1',kind:'exam',passed:false,submitted_at:new Date(now).toISOString()}];
 assert.throws(()=>assertAccess({kind:'exam',level:'A1'},attempts,now),{status:403});
 assert.equal(assertAccess({kind:'exam',level:'A1'},attempts,now+POLICY.retryMinutes*60000).level,'A1');
});
test('missing and unsigned auth cannot access server data',async()=>{
 await assert.rejects(requireUser({headers:{}}),{status:401});
 process.env.NEON_AUTH_BASE_URL='https://example.invalid/auth';
 await assert.rejects(requireUser({headers:{authorization:'Bearer forged-token'}}),{status:401});
 for(const action of ['progress','workshop','start','submit']){
  let status=200,body;const res={setHeader(){},status(s){status=s;return this;},json(b){body=b;return this;}};
  await handler({method:action==='progress'?'GET':'POST',query:{action},body:{action},headers:{origin:'https://angkor-academy.vercel.app'}},res);
  assert.equal(status,401);assert.ok(body.error);
 }
});
test('cross-site modifications are rejected',()=>{
 assert.equal(safeOrigin({headers:{origin:'https://attacker.example'}}),false);
 assert.equal(safeOrigin({headers:{}}),false);
 assert.equal(safeOrigin({headers:{origin:'https://angkor-academy.vercel.app'}}),true);
});

test('A1 covers ten units with forty substantive lessons and eight exercises each',()=>{
 assert.equal(a1Units.length,10);assert.equal(a1Lessons.length,40);
 for(const unit of a1Units)assert.equal(a1Lessons.filter(l=>l.unitId===unit.id).length,4);
 for(const l of a1Lessons){
  const qs=bank.filter(q=>q.lessonId===l.id);assert.equal(qs.length,8);
  for(const skill of ['grammar','vocabulary','reading','listening'])assert.equal(qs.filter(q=>q.skill===skill).length,2);
  assert.ok(l.explanation.length>120);assert.ok(l.task.length>30);assert.equal(l.words.length,4);
 }
});
test('all A1 exams sample all ten units and four skills without leaking answers',()=>{
 for(let i=0;i<10;i++)for(const kind of ['exam','review']){
  const qs=createQuestions({kind,level:'A1'});assert.equal(qs.length,40);
  for(const unit of a1Units)for(const skill of ['grammar','vocabulary','reading','listening'])assert.equal(qs.filter(q=>q.unitId===unit.id&&q.skill===skill).length,1);
 }
});
test('A1 unit locks require every earlier lesson and new curriculum invalidates short demo exams',()=>{
 assert.throws(()=>assertAccess({kind:'practice',lessonId:a1Lessons[4].id},[]),{status:403});
 assert.equal(assertAccess({kind:'practice',lessonId:a1Lessons[4].id},initial.slice(0,4)).lessonId,a1Lessons[4].id);
 const legacy=[...initial,{level:'A1',kind:'exam',passed:true,policy_version:'2026-11-18-v1',submitted_at:new Date(now-48*3600000).toISOString()},{level:'A1',kind:'review',passed:true,policy_version:'2026-11-18-v1',submitted_at:new Date(now).toISOString()}];
 assert.equal(levelState(legacy,now)[1].accessible,false);
 assert.equal(levelState(legacy,now)[0].examPassed,false);
});
test('public curriculum contains explanations and tasks but no assessment answer fields',async()=>{
 const {lessons:publicLessons}=await import('../src/english/course.js');
 for(const l of publicLessons){assert.equal('grammar' in l,false);assert.equal('questions' in l,false);assert.equal('reading' in l,false);}
 assert.equal(publicLessons.filter(l=>l.level==='A1').length,40);
});
test('strong global performance cannot hide an unlearned A1 unit',()=>{
 const qs=Array.from({length:40},(_,i)=>({id:String(i),unitId:`unit-${Math.floor(i/4)}`,skill:['grammar','vocabulary','reading','listening'][i%4],options:['a','b'],answer:0}));
 const result=grade(qs,qs.map((q,i)=>i<4?1:0),'exam');
 assert.equal(result.percent,90);assert.equal(result.passed,false);assert.equal(result.units['unit-0'].percent,0);
});
