import test from 'node:test';
import assert from 'node:assert/strict';
import {playFeedbackSound,setSoundsEnabled,soundsEnabled} from '../src/english/feedbackSound.js';

test('feedback plays distinct quiet tones only when enabled and stops on mute',async t=>{
 const oldWindow=globalThis.window,oldStorage=globalThis.localStorage;
 t.after(()=>{globalThis.window=oldWindow;globalThis.localStorage=oldStorage;});
 const store=new Map(),frequencies=[],levels=[];let created=0,stops=0,resumes=0;
 globalThis.localStorage={getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)};
 class Audio{
  constructor(){created++;this.state='suspended';this.currentTime=0;this.destination={};}
  async resume(){resumes++;this.state='running';}
  createOscillator(){return {frequency:{setValueAtTime:f=>frequencies.push(f)},connect(){},disconnect(){},start(){},stop(){stops++;}};}
  createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime:v=>levels.push(v),exponentialRampToValueAtTime(){}},connect(){},disconnect(){}};}
 }
 globalThis.window={AudioContext:Audio,dispatchEvent(){}};
 setSoundsEnabled(false);await playFeedbackSound(true);assert.equal(created,0);
 setSoundsEnabled(true);await playFeedbackSound(true);assert.deepEqual(frequencies,[660,880]);assert.equal(resumes,1);
 await playFeedbackSound(false);assert.deepEqual(frequencies.slice(-2),[330,262]);assert.ok(levels.every(v=>v<=0.06));
 const before=stops;setSoundsEnabled(false);assert.ok(stops>before);await playFeedbackSound(true);assert.equal(frequencies.length,4);
 assert.equal(soundsEnabled(),false);assert.equal(store.get('angkor-feedback-sounds'),'off');
});

test('mute still works with blocked storage and unsupported audio does not reject',async t=>{
 const oldWindow=globalThis.window,oldStorage=globalThis.localStorage;
 t.after(()=>{globalThis.window=oldWindow;globalThis.localStorage=oldStorage;});
 globalThis.localStorage={getItem(){throw new Error('blocked');},setItem(){throw new Error('blocked');}};
 globalThis.window={dispatchEvent(){}};
 setSoundsEnabled(false);assert.equal(soundsEnabled(),false);await assert.doesNotReject(()=>playFeedbackSound(true));
 setSoundsEnabled(true);assert.equal(soundsEnabled(),true);await assert.doesNotReject(()=>playFeedbackSound(false));
});
