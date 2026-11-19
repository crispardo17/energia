import test from 'node:test';import assert from 'node:assert/strict';import {existsSync} from 'node:fs';
import {lessons,units,levels} from '../server/content.js';import {createQuestions,publicQuestions,grade,bank,POLICY,assertAccess,levelState,normalizeAnswer,validAnswer} from '../server/assessment.js';import '../server/exams.js';
import {validateWorkshop} from '../server/english-workshop.js';
const correct=q=>q.type==='text'?q.accepted[0]:q.answer;
test('all six levels have forty sessions, ten units, eight exercises and a complete saved-work session plan',()=>{
 for(const level of levels){assert.equal(lessons.filter(l=>l.level===level.id).length,40);assert.equal(units.filter(u=>u.level===level.id).length,10);}
 for(const l of lessons){assert.equal(l.session.verbs.length,5);assert.equal(l.words.length,5);assert.equal(l.session.review.length,2);assert.equal(l.session.conversation.length,3);assert.ok(l.session.verbs.every(v=>v.examples.present&&v.examples.past&&v.examples.perfect&&v.examples.future));
  const qs=createQuestions({kind:'practice',lessonId:l.id});assert.equal(qs.length,8);assert.equal(qs.filter(q=>q.type==='text').length,1);assert.equal(grade(qs,qs.map(correct),'practice').passed,true);
  const bad=qs.map(correct);bad[qs.findIndex(q=>q.type==='text')]='unrelated words';assert.equal(grade(qs,bad,'practice').passed,false);
  for(const q of qs){if(q.audio)assert.ok(existsSync('public'+q.audio));if(q.options)assert.equal(new Set(q.options).size,q.options.length);}
  for(const q of publicQuestions(qs))for(const key of ['accepted','model','answer','why','transcript'])assert.equal(key in q,false);
 }
});
test('writing ignores punctuation/case and supported contractions, but not missing or unrelated content',()=>{
 const q={id:'write',type:'text',skill:'grammar',accepted:['I am ready.'],model:'I am ready.'};
 assert.equal(grade([q],["i'm READY!!!"],'practice').passed,true);assert.equal(grade([q],['I am'],'practice').passed,false);
 assert.equal(normalizeAnswer('We didn’t go.'),normalizeAnswer('we did not go'));assert.equal(validAnswer(q,0),false);assert.equal(validAnswer(q,'x'.repeat(1001)),false);assert.equal(validAnswer(q,null,true),true);
});
test('all expanded exams cover every unit/skill and do not expose the listening script in their own reading task',()=>{
 for(const level of levels){for(const kind of ['exam','review']){const qs=createQuestions({kind,level:level.id});assert.equal(qs.length,40);for(const u of units.filter(u=>u.level===level.id)){for(const skill of ['grammar','vocabulary','reading','listening'])assert.equal(qs.filter(q=>q.unitId===u.id&&q.skill===skill).length,1);const audio=qs.find(q=>q.unitId===u.id&&q.skill==='listening');const reading=qs.find(q=>q.unitId===u.id&&q.skill==='reading');assert.ok(!reading.prompt.includes(audio.transcript));}}}
});
test('sequential session access and legacy A1 progress are preserved while old short A2 exams cannot unlock B1',()=>{
 const now=Date.now(),past=new Date(now-72*3600000).toISOString(),later=new Date(now-24*3600000).toISOString();
 const done=lessons.filter(l=>l.level==='A1').map(l=>({level:'A1',lesson_id:l.id,kind:'practice',passed:true,submitted_at:past,policy_version:'2026-11-18-a1-v2'}));
 done.push({level:'A1',kind:'exam',passed:true,submitted_at:past,policy_version:'2026-11-18-a1-v2'},{level:'A1',kind:'review',passed:true,submitted_at:later,policy_version:'2026-11-18-a1-v2'});
 assert.equal(levelState(done)[1].accessible,true);assertAccess({kind:'practice',lessonId:'a2-u01-l1'},done);assert.throws(()=>assertAccess({kind:'practice',lessonId:'a2-u01-l2'},done),{status:403});
 const a2=lessons.filter(l=>l.level==='A2').map(l=>({level:'A2',lesson_id:l.id,kind:'practice',passed:true,submitted_at:past,policy_version:POLICY.version}));
 const old=[{level:'A2',kind:'exam',passed:true,submitted_at:past,policy_version:'2026-11-18-a1-v2'},{level:'A2',kind:'review',passed:true,submitted_at:later,policy_version:'2026-11-18-a1-v2'}];assert.equal(levelState([...done,...a2,...old])[2].accessible,false);
});
test('saved session state is bounded and strips arbitrary grading or identity properties',()=>{
 const state={part:5,conversation:['hello','',''],writing:'my phrase',passed:true,userId:'other'};assert.deepEqual(validateWorkshop(state),{part:5,conversation:['hello','',''],writing:'my phrase'});assert.throws(()=>validateWorkshop({...state,part:8}),{status:400});assert.throws(()=>validateWorkshop({...state,writing:'x'.repeat(2501)}),{status:400});
});
