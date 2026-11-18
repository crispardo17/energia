import {execFileSync} from 'node:child_process';import {randomUUID,randomBytes,randomInt,createHash} from 'node:crypto';import assert from 'node:assert/strict';import pg from 'pg';
import {createSessionHandler} from '../server/session-proxy.js';import {requireUser} from '../server/auth.js';import {getPool} from '../server/db.js';
const branch=process.env.AUTH_TEST_BRANCH;assert.ok(branch?.startsWith('dev-auth-mobile-'),'Use an isolated mobile-auth branch.');
const cli=args=>execFileSync('neon',args,{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
const base=JSON.parse(cli(['neon-auth','status','--branch',branch,'--output','json'])).base_url;
process.env.NEON_AUTH_BASE_URL=base;process.env.DATABASE_URL=cli(['connection-string',branch,'--pooled']);
const db=new pg.Pool({connectionString:process.env.DATABASE_URL,max:1});const handler=createSessionHandler({authUrl:()=>base});
const origin='https://angkor-academy.vercel.app',host=new URL(origin).host,jar=new Map();const email=`qa-mobile-${randomUUID()}@example.invalid`,password=randomBytes(24).toString('hex');let userId;
async function call(path,body){const res={headers:{},statusCode:200,setHeader(k,v){this.headers[k.toLowerCase()]=v;},status(n){this.statusCode=n;return this;},json(d){this.data=d;return this;},end(buffer){this.data=JSON.parse(buffer.toString());return this;}};
 await handler({url:'/api/session/'+path,method:body?'POST':'GET',headers:{host,origin,'content-type':'application/json',cookie:[...jar].map(([n,v])=>n+'='+v).join('; ')},body},res);
 for(const cookie of res.headers['set-cookie']||[]){assert.match(cookie,/HttpOnly/i);assert.match(cookie,/Secure/i);assert.match(cookie,/SameSite=Lax/i);assert.doesNotMatch(cookie,/Domain=|Partitioned/i);const first=cookie.split(';')[0],i=first.indexOf('=');const name=first.slice(0,i),value=first.slice(i+1);if(/Max-Age=0/i.test(cookie)||!value)jar.delete(name);else jar.set(name,value);}
 return res;
}
try{
 const signup=await call('sign-up/email',{name:'Synthetic mobile login',email,password});assert.equal(signup.statusCode,200,signup.data.code);userId=signup.data.user.id;assert.ok(!signup.data.token);
 const otp=String(randomInt(100000,1000000));const updated=await db.query('UPDATE neon_auth.verification SET value=$1 WHERE identifier=$2',[createHash('sha256').update(otp).digest('base64url')+':0','email-verification-otp-'+email]);assert.equal(updated.rowCount,1);
 assert.equal((await call('email-otp/verify-email',{email,otp})).statusCode,200);
 const login=await call('sign-in/email',{email,password});assert.equal(login.statusCode,200,login.data.code);assert.ok(jar.has('__Secure-neon-auth.session_token'));
 const session=await call('get-session');assert.equal(session.statusCode,200);assert.equal(session.data.user.id,userId);const jwt=session.headers['set-auth-jwt'];assert.ok(jwt,'Managed JWT header must survive the proxy');const headers={authorization:'Bearer '+jwt,'x-session-id':session.data.session.id};assert.equal((await requireUser({headers})).id,userId);
 const restored=await call('get-session');assert.equal(restored.data.user.id,userId,'Session must be restored with only first-party cookies');
 assert.equal((await call('sign-out',{})).statusCode,200);assert.ok(!(await call('get-session')).data?.user);await assert.rejects(requireUser({headers}),e=>e.status===401);
 const google=await call('sign-in/social',{provider:'google',callbackURL:origin,disableRedirect:true});assert.equal(google.statusCode,200,google.data.code);assert.ok(jar.has('__Secure-neon-auth.session_challenge'));assert.ok(google.data.url);assert.equal(new URL(google.data.url).protocol,'https:');
 console.log('PASS: first-party signup, verification, password login, session restoration, managed JWT, protected identity, logout/revocation, and Google challenge cookies with Secure/HttpOnly/Lax and no third-party domain.');
}finally{
 if(userId)cli(['neon-auth','user','delete',userId,'--branch',branch]);await db.query('DELETE FROM neon_auth.verification WHERE identifier LIKE $1',['%'+email+'%']);await db.end();await getPool().end();console.log('Synthetic mobile-auth identity removed.');
}
