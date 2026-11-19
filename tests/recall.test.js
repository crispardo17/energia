import test from 'node:test';
import assert from 'node:assert/strict';
import {recallActivities,normalizeRecall} from '../src/english/recallActivities.js';
import {engineeringLessons} from '../server/engineering/content.js';
import {lessons} from '../server/content.js';

test('every technical concept has an answerable recall and a complete example sequence',()=>{
 for(const lesson of engineeringLessons)for(let i=0;i<lesson.body.concepts.length;i++){
  const activities=recallActivities(lesson,true,i);
  const choice=activities[0],order=activities[1];
  assert.equal(choice.options.filter(o=>o.id===choice.answer).length,1,lesson.id);
  assert.ok(choice.options.length>1,lesson.id);
  assert.equal(choice.context,lesson.body.concepts[i].explanation);
  if(i===lesson.body.concepts.length-1)assert.deepEqual(order.answer.map(id=>order.options.find(o=>o.id===id).text),lesson.body.flow);
  else assert.equal(order,undefined);
  assert.deepEqual(activities,recallActivities(lesson,true,i));
 }
});

test('all English sessions practice every word with unambiguous activities',()=>{
 for(const lesson of lessons){
  const activities=recallActivities(lesson,false);
  assert.equal(activities.length,lesson.words.length,lesson.id);
  for(const activity of activities){
   assert.equal(activity.options.filter(o=>o.id===activity.answer).length,1,lesson.id);
   assert.ok(activity.options.length>1,lesson.id);
   assert.equal(new Set(activity.options.map(o=>normalizeRecall(o.text))).size,activity.options.length);
  }
 }
});

test('free recall accepts case and punctuation without removing meaningful accents',()=>{
 assert.equal(normalizeRecall('  HELLO!  '),'hello');
 assert.notEqual(normalizeRecall('sí'),normalizeRecall('si'));
});
