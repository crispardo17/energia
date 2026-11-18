import test from 'node:test';import assert from 'node:assert/strict';
import {emailSignUp} from '../src/english/api.js';
test('registration validates confirmation and identity fields before sending credentials',async()=>{
 let calls=0;const original=globalThis.fetch;globalThis.fetch=async()=>{calls++;throw new Error('Unexpected credential request');};
 try{
  const valid={name:'Test learner',email:'learner@example.invalid',password:'Synthetic-password-123',confirmation:'Synthetic-password-123'};
  await assert.rejects(emailSignUp({...valid,confirmation:'different-password'}),/no coinciden/);
  await assert.rejects(emailSignUp({...valid,name:' '}),/nombre/);
  await assert.rejects(emailSignUp({...valid,email:'invalid'}),/correo/);
  await assert.rejects(emailSignUp({...valid,password:'short',confirmation:'short'}),/8 a 128/);
  assert.equal(calls,0);
 }finally{globalThis.fetch=original;}
});
