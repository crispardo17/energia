import test from 'node:test';import assert from 'node:assert/strict';
import {advanceGuide,retreatGuide} from '../src/english/guideNavigation.js';
test('a guide reaches every step of every concept once, then finishes instead of looping',()=>{
 let position={step:0,concept:0},visited=[];
 for(let i=0;i<16;i++){visited.push([position.concept,position.step]);position=advanceGuide(position.step,position.concept,4);}
 assert.equal(new Set(visited.map(v=>v.join(':'))).size,16);assert.deepEqual(position,{step:3,concept:3,finished:true});
 assert.deepEqual(advanceGuide(3,0,1),{step:3,concept:0,finished:true});
});
test('back navigation crosses a concept boundary without losing the preceding step',()=>{
 assert.deepEqual(retreatGuide(0,1),{step:3,concept:0});assert.deepEqual(retreatGuide(2,1),{step:1,concept:1});assert.deepEqual(retreatGuide(0,0),{step:0,concept:0});
});
