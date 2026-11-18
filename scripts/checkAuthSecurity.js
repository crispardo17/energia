import {execFileSync} from 'node:child_process';
import {randomBytes,randomUUID,randomInt,createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import pg from 'pg';
import {requireUser} from '../server/auth.js';
const branch=process.env.AUTH_TEST_BRANCH;
assert.ok(branch?.startsWith('dev-auth-security-'),'This test only runs on an isolated auth security branch.');
const cli=(args)=>execFileSync('neon',args,{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
const status=JSON.parse(cli(['neon-auth','status','--branch',branch,'--output','json']));
process.env.DATABASE_URL=cli(['connection-string',branch,'--pooled']);
process.env.NEON_AUTH_BASE_URL=status.base_url;
const db=new pg.Pool({connectionString:process.env.DATABASE_URL,max:1});
const base=status.base_url,origin='https://angkor-academy.vercel.app';
const email=`qa-security-${randomUUID()}@example.invalid`,password=randomBytes(24).toString('hex');let userId;
const call=async(path,body,cookie)=>{const r=await fetch(base+path,{method:body?'POST':'GET',headers:{Origin:origin,...(body?{'Content-Type':'application/json'}:{}),...(cookie?{Cookie:cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json(),cookie:r.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ')};};
try{
 const signup=await call('/sign-up/email',{name:'Synthetic security test',email,password});
 assert.equal(signup.status,200,signup.data.code||'signup failed');userId=signup.data.user.id;assert.ok(!signup.data.token,'Unverified registration must not create a session');
 const login=await call('/sign-in/email',{email,password});assert.equal(login.status,403);assert.equal(login.data.code,'EMAIL_NOT_VERIFIED');
 const invalid=await call('/email-otp/verify-email',{email,otp:'invalid'});assert.ok(invalid.status>=400);
 console.log('PASS: signup creates no session, unverified password login is rejected, invalid email codes are rejected.');
 // Only in this isolated branch, substitute a known synthetic OTP hash to test
 // the provider flow without sending mail to a real person or reading user codes.
 const otp=String(randomInt(100000,1000000));
 const hash=createHash('sha256').update(otp).digest('base64url')+':0';
 const changed=await db.query('UPDATE neon_auth.verification SET value=$1 WHERE identifier=$2',[hash,'email-verification-otp-'+email]);assert.equal(changed.rowCount,1);
 const verified=await call('/email-otp/verify-email',{email,otp});assert.equal(verified.status,200,verified.data.code);
 const signedIn=await call('/sign-in/email',{email,password});assert.equal(signedIn.status,200);
 const token=await call('/token',undefined,signedIn.cookie);assert.equal(token.status,200);
 const payload=JSON.parse(Buffer.from(token.data.token.split('.')[1],'base64url'));
 const current=await call('/get-session',undefined,signedIn.cookie);assert.ok(current.data.session.id);
 const headers={authorization:`Bearer ${token.data.token}`,'x-session-id':current.data.session.id};
 assert.equal((await requireUser({headers})).id,userId);
 await assert.rejects(requireUser({headers:{...headers,'x-session-id':randomUUID()}}),e=>e.status===401);
 const resetRequest=await call('/forget-password/email-otp',{email});assert.equal(resetRequest.status,200);
 const updated=await db.query('UPDATE neon_auth.verification SET value=$1 WHERE identifier=$2',[hash,'forget-password-otp-'+email]);assert.equal(updated.rowCount,1);
 const newPassword=randomBytes(24).toString('hex');
 const reset=await call('/email-otp/reset-password',{email,otp,password:newPassword});assert.equal(reset.status,200,reset.data.code);
 assert.equal((await db.query('SELECT id FROM neon_auth.session WHERE "userId"=$1',[userId])).rowCount,0,'Reset must remove all sessions');
 await assert.rejects(requireUser({headers}),e=>e.status===401,'Course APIs must reject the old JWT immediately after reset');
 const old=await call('/get-session',undefined,signedIn.cookie);assert.ok(!old.data?.user,'Old session must not work');
 assert.ok((await call('/sign-in/email',{email,password})).status>=400,'Old password must not work');
 assert.equal((await call('/sign-in/email',{email,password:newPassword})).status,200);
 assert.ok((await call('/email-otp/reset-password',{email,otp,password})).status>=400,'OTP reuse must fail');
 console.log('PASS: email verification, password reset, revocation of existing sessions, rejection of old password and consumed OTP, login with new password.');

}finally{
 if(userId)cli(['neon-auth','user','delete',userId,'--branch',branch]);
 await db.query('DELETE FROM neon_auth.verification WHERE identifier LIKE $1',['%'+email+'%']);await db.end();
 console.log('Synthetic identity and verification records removed.');
}
