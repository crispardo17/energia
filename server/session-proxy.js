import {handleAuthRequest,parseSetCookies,serializeSetCookie} from '@neon/auth/server';
import {normalize} from './db.js';

const endpoints=new Map([
 ['get-session','GET'],['token','GET'],['sign-in/email','POST'],['sign-in/social','POST'],
 ['sign-up/email','POST'],['sign-out','POST'],['email-otp/send-verification-otp','POST'],
 ['email-otp/verify-email','POST'],['forget-password/email-otp','POST'],['email-otp/reset-password','POST'],
]);
const productionOrigin='https://angkor-academy.vercel.app';
export function createSessionHandler({upstream=handleAuthRequest,authUrl=()=>normalize(process.env.NEON_AUTH_BASE_URL)}={}){
 return async function sessionHandler(req,res){
  res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
  const host=req.headers.host||new URL(productionOrigin).host;
  const permittedHosts=new Set([new URL(productionOrigin).host]);
  if(process.env.VERCEL_URL)permittedHosts.add(process.env.VERCEL_URL);
  if(process.env.NODE_ENV!=='production')for(const h of ['localhost:3000','localhost:3003','127.0.0.1:3003','127.0.0.1:3005','localhost:3006','127.0.0.1:3006'])permittedHosts.add(h);
  if(!permittedHosts.has(host))return res.status(403).json({error:'Abre Angkor Academy desde su dirección oficial.',code:'INVALID_ORIGIN'});
  const origin=(host.startsWith('localhost:')||host.startsWith('127.0.0.1:')?'http://':'https://')+host;
  const url=new URL(req.url||'/api/session',origin);
  const path=typeof req.query?.path==='string'?req.query.path:url.pathname.replace(/^\/api\/session\/?/,'');
  if(!endpoints.has(path))return res.status(404).json({error:'Operación de acceso no disponible.'});
  if(req.method!==endpoints.get(path)){res.setHeader('Allow',endpoints.get(path));return res.status(405).json({error:'Método no permitido.'});}
  // Verify the browser origin before forwarding any state-changing request.
  // Fetch Metadata permits same-origin clients that omit Origin, without
  // accepting cross-site forms or silently replacing an untrusted origin.
  if(req.method==='POST'&&!(req.headers.origin===origin||(!req.headers.origin&&req.headers['sec-fetch-site']==='same-origin')))return res.status(403).json({error:'Abre el acceso desde Angkor Academy.',code:'INVALID_ORIGIN'});
  try{
   const base=authUrl();if(new URL(base).protocol!=='https:')throw new Error('Auth URL must use HTTPS');
   const headers=new Headers();
   for(const name of ['cookie','user-agent','content-type','referer','x-neon-client-info'])if(typeof req.headers[name]==='string')headers.set(name,req.headers[name]);
   headers.set('origin',origin);
   url.pathname='/api/session/'+path;url.searchParams.delete('path');
   let body;
   if(req.method==='POST'){
    if(typeof req.body==='string'){if(Buffer.byteLength(req.body)>32768)return res.status(413).json({error:'La solicitud es demasiado grande.'});body=req.body;}
    else {body=JSON.stringify(req.body??{});if(Buffer.byteLength(body)>32768)return res.status(413).json({error:'La solicitud es demasiado grande.'});}
    headers.set('content-type','application/json');
   }
   const request=new Request(url,{method:req.method,headers,...(body!==undefined?{body}:{})});
   // The supported Neon toolkit filters transport headers and unrelated cookies.
   // Always fetch the managed session: the frontend needs Neon's fresh JWT,
   // not a cached session containing its opaque session-token cookie value.
   const response=await upstream(base,request,path);
   const cookies=[];
   for(const header of response.headers.getSetCookie())for(const cookie of parseSetCookies(header)){
    cookies.push(serializeSetCookie({...cookie,domain:undefined,path:'/',httpOnly:true,secure:true,sameSite:'lax',partitioned:undefined}));
   }
   if(cookies.length)res.setHeader('Set-Cookie',cookies);
   for(const name of ['content-type','set-auth-jwt','x-neon-ret-request-id']){const value=response.headers.get(name);if(value)res.setHeader(name,value);}
   // Do not forward content-encoding or length after fetch has decoded the body.
   return res.status(response.status).end(Buffer.from(await response.arrayBuffer()));
  }catch{
   // Never log OAuth verifiers, URLs with codes, cookies, or credentials.
   console.error('Authentication connection failed',{path,code:'AUTH_UPSTREAM_UNAVAILABLE'});
   return res.status(503).json({error:'No pudimos conectar con el acceso. Intenta de nuevo.',code:'AUTH_UPSTREAM_UNAVAILABLE'});
  }
 };
}
