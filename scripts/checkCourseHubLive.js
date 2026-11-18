// Read-only production smoke check. Full authenticated progression is tested
// with synthetic users on an isolated branch by checkIndependentLearning.js.
import assert from 'node:assert/strict';
const base='https://angkor-academy.vercel.app';
const r=await fetch(base+'/api/courses?action=catalog');assert.equal(r.status,200);const {courses}=await r.json();
const tech=courses.find(c=>c.id==='engineering-ai');assert.equal(tech.outline.lessonCount,48);assert.equal(tech.outline.stages.length,9);assert.equal(tech.lessons[0].id,'eng-base-01');
const english=courses.find(c=>c.id==='english');assert.equal(english.outline.units.length,10);
for(const lesson of tech.lessons){assert.ok(!('assessment' in lesson));assert.ok(!('answer' in lesson));}
assert.equal((await fetch(base+'/api/courses?action=state')).status,401);
assert.equal((await fetch(base+'/api/courses?action=learning')).status,401);
console.log('Production verified: 48 technical sessions, 9 stages, beginner entry, public catalog without assessment keys, protected profiles and learning plans.');
