// Ephemeral synthetic account, removed at the end. Never uses a real student's login.
import { config } from 'dotenv';
import { randomUUID, randomBytes } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import pg from 'pg';
import assert from 'node:assert/strict';
import { normalize } from '../server/db.js';
import { bank } from '../server/assessment.js';
config({path:process.env.ACADEMY_ENV_FILE||'.env.local',quiet:true});
const base='https://angkor-academy.vercel.app';
const auth=normalize(process.env.NEON_AUTH_BASE_URL);
const pool=new pg.Pool({connectionString:normalize(process.env.DATABASE_URL),max:1});
let userId;
try {
 const signup=await fetch(auth+'/sign-up/email',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify({name:'Angkor automated test',email:`qa-${randomUUID()}@example.invalid`,password:randomBytes(24).toString('hex')})});
 const data=await signup.json();
 if(!signup.ok)throw new Error(`Test signup failed (${signup.status}): ${data.code||data.message||'unknown'}`);
 userId=data.user?.id;
 assert.ok(userId,'Test account ID missing');
 assert.ok(data.token,'Email verification is required: run scripts/checkAuthSecurity.js on an isolated branch instead.');
 const cookie=signup.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');
 const session=await fetch(auth+'/get-session',{headers:{Cookie:cookie,Origin:base}});
 const sessionId=(await session.clone().json()).session.id;
 let jwt=session.headers.get('set-auth-jwt');
 if(!jwt){const response=await fetch(auth+'/token',{headers:{Cookie:cookie,Origin:base}});const d=await response.json();jwt=d.token;}
 assert.ok(jwt,'Neon did not issue a test JWT');
 const call=async(action,body)=>{
  const r=await fetch(`${base}/api/academy${body?'':`?action=${action}`}`,{method:body?'POST':'GET',headers:{Authorization:`Bearer ${jwt}`,'X-Session-Id':sessionId,Origin:base,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify({action,...body})}:{})});return {status:r.status,data:await r.json()};
 };
 const first=await call('progress');assert.equal(first.status,200,JSON.stringify(first.data));assert.equal(first.data.stats.attempts,0);
 assert.equal((await call('start',{kind:'practice',lessonId:'a2-1'})).status,403);
 assert.equal((await call('start',{kind:'exam',level:'A1'})).status,403);
 const started=await call('start',{kind:'practice',lessonId:'a1-u01-l1'});assert.equal(started.status,200,JSON.stringify(started.data));
 for(const q of started.data.questions){assert.equal('answer' in q,false);assert.equal('transcript' in q,false);}
 const answers=started.data.questions.map(q=>{const original=bank.find(x=>x.id===q.id);return q.options.indexOf(original.options[original.answer]);});
 const submitted=await call('submit',{id:started.data.id,answers});assert.equal(submitted.status,200,JSON.stringify(submitted.data));assert.equal(submitted.data.percent,100);assert.equal(submitted.data.passed,true);
 const duplicate=await call('submit',{id:started.data.id,answers:answers.map(()=>0)});assert.equal(duplicate.data.percent,100);
 const saved=await call('progress');assert.equal(saved.data.stats.attempts,1);assert.ok(saved.data.levels[0].completed.includes('a1-u01-l1'));assert.equal(saved.data.levels[1].accessible,false);
 console.log('Live integration passed: genuine Neon session, protected API, server grading, durable statistics, idempotency and level gates.');
} catch(error) {console.error(error.message);process.exitCode=1;}
finally {
 if(userId){
  await pool.query('DELETE FROM academy.attempts WHERE user_id=$1',[userId]);
  await pool.query('DELETE FROM academy.learners WHERE id=$1',[userId]);
  execFileSync('neon',['neon-auth','user','delete',userId,'--project-id','winter-shadow-04529699','--branch','br-winter-glade-aurinh5k'],{stdio:'pipe'});
  console.log('Synthetic test account and results removed.');
 }
 await pool.end();
}
