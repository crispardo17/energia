import test from 'node:test';import assert from 'node:assert/strict';
import {engineeringLessons,stages} from '../server/engineering/content.js';
import {prepareQuestions,safeQuestions,gradeEngineering,engineeringState} from '../server/engineering/assessment.js';
import handler from '../api/courses.js';
test('engineering covers a beginner entry and the complete backend/AI route with substantive lessons, code, cases and rubrics',()=>{
 assert.equal(stages.length,9);assert.equal(engineeringLessons.length,48);assert.equal(engineeringLessons[0].id,'eng-base-01');
 for(const s of stages)assert.ok(engineeringLessons.filter(l=>l.stage===s.number).length>=3);
 for(const l of engineeringLessons){assert.equal(l.concepts.length,4);assert.equal(l.assessment.length,8);assert.ok(l.code.length>90);assert.ok(l.task.length>70);assert.equal(l.body.rubric.length,4);assert.ok(l.concepts.every(c=>c.explanation.length>80));}
});
test('shuffled choice/order questions retain correct answer mapping and hide keys',()=>{
 for(const l of engineeringLessons){const qs=prepareQuestions(l.assessment);const result=gradeEngineering(qs,qs.map(q=>q.answer));assert.equal(result.percent,100);assert.equal(result.quizPassed,true);for(const q of safeQuestions(qs)){assert.ok(!('answer' in q));assert.ok(!('why' in q));}}
});
test('a high global score cannot compensate a critical architecture error',()=>{
 const qs=prepareQuestions(engineeringLessons[0].assessment);const answers=qs.map(q=>q.answer);const i=qs.findIndex(q=>q.critical&&q.type!=='order');answers[i]=(answers[i]+1)%qs[i].options.length;
 const result=gradeEngineering(qs,answers);assert.equal(result.percent,88);assert.equal(result.quizPassed,false);assert.ok(result.reinforce.length);assert.ok(result.criticalErrors.length);
});
test('text length is never used to approve comprehension or progression',()=>{
 const lessons=engineeringLessons.map(l=>({id:l.id,version:'v1'}));
 for(const status of ['draft','reinforce','awaiting_review','changes_requested'])assert.equal(engineeringState(lessons,[{lesson_id:lessons[0].id,version:'v1',status}])[1].accessible,false);
 assert.equal(engineeringState(lessons,[{lesson_id:lessons[0].id,version:'v1',status:'approved'}])[1].accessible,true);
 assert.equal(engineeringState(lessons,[{lesson_id:lessons[0].id,version:'old',status:'approved'}])[1].accessible,false);
});
test('invalid answers, incomplete ordering and missing application evidence are rejected',()=>{
 const qs=prepareQuestions(engineeringLessons[0].assessment);assert.throws(()=>gradeEngineering(qs,[]),{status:400});
 const answers=qs.map(q=>q.answer);answers[qs.findIndex(q=>q.type==='order')]=[0,0,0,0];assert.throws(()=>gradeEngineering(qs,answers),{status:400});
 const plain=qs.map(({application,...q})=>q);assert.equal(gradeEngineering(plain,plain.map(q=>q.answer)).quizPassed,false,'A quiz without application evidence must not unlock a lesson');
});
test('course APIs refuse unauthenticated progress and cross-origin writes',async()=>{
 for(const [method,action,origin,expected] of [['GET','state',null,401],['POST','enroll','https://attacker.example',403],['POST','review','https://angkor-academy.vercel.app',401]]){
 let status=200;const res={setHeader(){},status(s){status=s;return this;},json(){return this;}};
 // Real handler does not obtain a DB connection before authenticating private actions.
 await handler({method,headers:origin?{origin}:{},query:{action},body:{action}},res);assert.equal(status,expected);
 }
});
