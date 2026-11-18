import test from 'node:test';import assert from 'node:assert/strict';
import {createSessionHandler} from '../server/session-proxy.js';
const host='angkor-academy.vercel.app',origin='https://'+host;
function response(){return {headers:{},statusCode:200,setHeader(k,v){this.headers[k.toLowerCase()]=v;},status(s){this.statusCode=s;return this;},json(d){this.body=d;return this;},end(data){this.body=data;return this;}};}
test('OAuth challenge and session cookies become first-party Secure HttpOnly Lax cookies',async()=>{
 let received;const handler=createSessionHandler({authUrl:()=> 'https://auth.example.test/db/auth',upstream:async(base,req,path)=>{
  received={base,req,path};const headers=new Headers({'content-type':'application/json','set-auth-jwt':'synthetic-jwt','content-encoding':'gzip'});
  headers.append('set-cookie','__Secure-neon-auth.session_challenge=test-only; Domain=auth.example.test; Path=/; HttpOnly; Secure; SameSite=None; Partitioned');
  return new Response('{"redirect":true}',{headers});
 }});
 const res=response();await handler({url:'/api/session?path=sign-in/social',query:{path:'sign-in/social'},method:'POST',headers:{host,origin,'content-type':'application/json','x-forwarded-host':'attacker.invalid'},body:{provider:'google',callbackURL:origin}},res);
 assert.equal(res.statusCode,200);assert.equal(received.path,'sign-in/social');assert.equal(received.req.headers.get('origin'),origin);assert.ok(!received.req.headers.has('x-forwarded-host'));assert.equal(new URL(received.req.url).searchParams.has('path'),false);
 const cookie=res.headers['set-cookie'][0];assert.match(cookie,/Secure/i);assert.match(cookie,/HttpOnly/i);assert.match(cookie,/SameSite=Lax/i);assert.doesNotMatch(cookie,/Domain=|Partitioned/i);assert.equal(res.headers['set-auth-jwt'],'synthetic-jwt');assert.equal(res.headers['content-encoding'],undefined);
});
test('cross-site posts, foreign hosts, arbitrary paths and wrong methods never reach auth',async()=>{
 let calls=0;const handler=createSessionHandler({upstream:async()=>{calls++;throw Error();}});
 for(const [headers,path,method,status] of [[{host,origin:'https://attacker.invalid'},'sign-out','POST',403],[{host:'attacker.invalid',origin},'sign-in/email','POST',403],[{host,origin},'../admin/create-user','POST',404],[{host,origin},'token','POST',405],[{host},'sign-out','POST',403]]){
  const res=response();await handler({url:'/api/session',query:{path},method,headers,body:{}},res);assert.equal(res.statusCode,status);
 }assert.equal(calls,0);
});
test('session checks forward the verifier and cookie but preserve the managed JWT response',async()=>{
 const handler=createSessionHandler({authUrl:()=> 'https://auth.example.test/db/auth',upstream:async(base,request,path)=>{
  assert.equal(path,'get-session');assert.equal(new URL(request.url).searchParams.get('neon_auth_session_verifier'),'synthetic-only');assert.equal(request.headers.get('cookie'),'__Secure-neon-auth.session_challenge=test-only');
  return Response.json({session:{id:'test-session'},user:{id:'test-user'}},{headers:{'set-auth-jwt':'fresh-signed-jwt'}});
 }});
 const res=response();await handler({method:'GET',url:'/api/session/get-session?neon_auth_session_verifier=synthetic-only',headers:{host,cookie:'__Secure-neon-auth.session_challenge=test-only'}},res);assert.equal(res.statusCode,200);assert.equal(res.headers['set-auth-jwt'],'fresh-signed-jwt');
});
test('expired OAuth exchanges produce a recovery message instead of a raw 400',async()=>{
 const {sessionError}=await import('../src/english/accountSecurity.js');assert.equal(sessionError({error:{status:400}},true).code,'OAUTH_CALLBACK_FAILED');assert.notEqual(sessionError({status:503},true).code,'OAUTH_CALLBACK_FAILED');
});
