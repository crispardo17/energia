import test from 'node:test';
import assert from 'node:assert/strict';
import {accountSecurity} from '../src/english/accountSecurity.js';

test('email ownership and reset use different provider operations; confirmation is never sent',async()=>{
 const calls=[];const ok=async(op,value)=>{calls.push([op,value]);return {data:{success:true}};};
 const security=accountSecurity(async()=>({forgetPassword:{emailOtp:v=>ok('request-reset',v)},emailOtp:{sendVerificationOtp:v=>ok('request-verification',v),verifyEmail:v=>ok('verify',v),resetPassword:v=>ok('reset',v)}}));
 await security.sendCode(' learner@example.invalid ','verify');await security.sendCode('learner@example.invalid','reset');
 await security.verify('learner@example.invalid','123456');
 await security.reset('learner@example.invalid','123456','New-password-123','New-password-123');
 assert.deepEqual(calls.map(c=>c[0]),['request-verification','request-reset','verify','reset']);
 assert.deepEqual(calls[0][1],{email:'learner@example.invalid',type:'email-verification'});
 assert.deepEqual(calls[3][1],{email:'learner@example.invalid',otp:'123456',password:'New-password-123'});
});
test('invalid codes, mismatched passwords and invalid emails never reach auth',async()=>{
 let calls=0;const security=accountSecurity(async()=>{calls++;throw new Error('Unexpected request');});
 await assert.rejects(security.sendCode('bad','reset'),/correo/);
 await assert.rejects(security.verify('a@example.invalid','abc123'),/6 dígitos/);
 await assert.rejects(security.reset('a@example.invalid','123456','New-password-123','different'),/no coinciden/);
 await assert.rejects(security.reset('a@example.invalid','123456','short','short'),/8 a 128/);
 assert.equal(calls,0);
});
test('unknown accounts receive neutral reset result and rate limits are actionable',async()=>{
 const unknown=accountSecurity(async()=>({forgetPassword:{emailOtp:async()=>({error:{code:'USER_NOT_FOUND'}})}}));
 await assert.doesNotReject(unknown.sendCode('absent@example.invalid','reset'));
 const limited=accountSecurity(async()=>({emailOtp:{verifyEmail:async()=>({error:{code:'TOO_MANY_ATTEMPTS'}})}}));
 await assert.rejects(limited.verify('a@example.invalid','123456'),/Demasiados intentos/);
});

test('verification failures from SDK error objects and thrown errors open the same verification flow',async()=>{
 const {signInError}=await import('../src/english/accountSecurity.js');
 for(const error of [{code:'EMAIL_NOT_VERIFIED'},{code:'EMAIL_VERIFICATION_REQUIRED'},new Error('Email verification required'),{body:{code:'EMAIL_NOT_VERIFIED'}},{error:{message:'Email is not verified'}}])assert.equal(signInError(error).code,'EMAIL_NOT_VERIFIED');
 for(const error of [{code:'INVALID_EMAIL_OR_PASSWORD'},new Error('Invalid origin'),{status:403,message:'Forbidden'}])assert.notEqual(signInError(error).code,'EMAIL_NOT_VERIFIED');
});
