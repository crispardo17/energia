import test from 'node:test';import assert from 'node:assert/strict';
import {validatePreferences,reviewDelay,rememberFeedback} from '../server/learning.js';
import {engineeringLessons} from '../server/engineering/content.js';
import {gradeEngineering,prepareQuestions} from '../server/engineering/assessment.js';
import {lessons} from '../server/content.js';
test('learning preferences accept accessibility options and reject arbitrary persisted properties',()=>{
 const p={largeText:true,simple:true,minutes:5,audioRate:0.7};assert.deepEqual(validatePreferences({...p,role:'admin'}),p);
 assert.throws(()=>validatePreferences({...p,minutes:0}),{status:400});assert.throws(()=>validatePreferences({...p,audioRate:5}),{status:400});
});
test('spaced reviews increase intervals while errors return to immediate reinforcement',()=>{
 assert.deepEqual([0,1,2,3,4,20].map(s=>reviewDelay(s,true)),[1,3,7,14,30,30]);assert.equal(reviewDelay(4,false),0);
});
test('one error cannot be hidden by successes on the same skill; user and lesson stay bound',async()=>{
 const calls=[];await rememberFeedback({query:async(sql,args)=>{calls.push(args);}},'learner','english',null,[{lessonId:'a1-u01-l1',skill:'listening',correct:true},{lessonId:'a1-u01-l1',skill:'listening',correct:false},{lessonId:'a1-u01-l2',skill:'listening',correct:true}]);
 assert.deepEqual(calls,[['learner','english','a1-u01-l1','listening',false],['learner','english','a1-u01-l2','listening',true]]);
});
test('all lessons require objective application; neither notes nor requested approval are grading inputs',()=>{
 for(const l of engineeringLessons){const q=prepareQuestions(l.assessment);assert.equal(gradeEngineering(q,q.map(x=>x.answer)).quizPassed,true);const app=q.findIndex(x=>x.application&&x.type!=='order');const a=q.map(x=>x.answer);a[app]=(a[app]+1)%q[app].options.length;assert.equal(gradeEngineering(q,a).quizPassed,false);}
 for(const l of lessons.filter(l=>l.level==='A1'))assert.ok(l.translation.length>20&&!l.translation.startsWith('Lee el texto'));
});

test('library lab distinguishes identity, ownership, confirmed effects and lost responses',async()=>{
 const {initialLibrary,libraryRequest}=await import('../src/english/learningLabs.js');const state=initialLibrary(),input={authenticated:true,ownsResource:true,bookId:'bookA',key:'request-1'};
 assert.equal(libraryRequest(state,{...input,authenticated:false}).status,401);assert.equal(libraryRequest(state,{...input,ownsResource:false}).status,403);
 const lost=libraryRequest(state,{...input,lost:true});assert.equal(lost.status,0);assert.equal(lost.state.stock.bookA,1);
 const retry=libraryRequest(lost.state,input);assert.equal(retry.replayed,true);assert.equal(retry.state.stock.bookA,1);assert.equal(Object.keys(retry.state.operations).length,1);
 assert.equal(libraryRequest(retry.state,{...input,bookId:'bookB'}).status,409);
});
test('classifier lab computes both error types and handles zero predicted positives',async()=>{
 const {classifierMetrics}=await import('../src/english/learningLabs.js');const m=classifierMetrics(0.5);assert.deepEqual([m.tp,m.fp,m.tn,m.fn],[2,2,1,1]);
 assert.equal(classifierMetrics(1).precision,null);assert.equal(classifierMetrics(1).recall,0);
});
