import { createRemoteJWKSet, jwtVerify } from 'jose';
import { normalize,getPool } from './db.js';
let jwks;
export async function requireUser(req) {
 const token=req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
 const unauthorized=()=>Object.assign(new Error('Ingresa con tu cuenta para guardar tu aprendizaje.'),{status:401});
 if(!token) throw unauthorized();
 const base=normalize(process.env.NEON_AUTH_BASE_URL);
 if(!base.startsWith('https://')) throw Object.assign(new Error('El acceso con Google no está configurado.'),{status:503});
 jwks??=createRemoteJWKSet(new URL(base.replace(/\/$/,'')+'/.well-known/jwks.json'));
 try {
  const origin=new URL(base).origin;
  const {payload}=await jwtVerify(token,jwks,{issuer:origin,audience:origin,algorithms:['EdDSA','ES256','RS256'],requiredClaims:['sub','exp','iat']});
  if(!payload.sub||payload.banned) throw unauthorized();
  // JWT signatures alone remain valid until expiry after a password reset.
  // Require the accompanying session to still exist and belong to this user.
  const sessionId=req.headers['x-session-id'];
  if(typeof sessionId!=='string'||sessionId.length>128)throw unauthorized();
  const active=await getPool().query('SELECT s.id FROM neon_auth.session s JOIN neon_auth."user" u ON u.id=s."userId" WHERE s.id=$1 AND s."userId"=$2 AND s."expiresAt">now() AND u."emailVerified"=true AND COALESCE(u.banned,false)=false',[sessionId,payload.sub]);
  if(!active.rowCount)throw unauthorized();
  return {id:payload.sub,name:typeof payload.name==='string'?payload.name.slice(0,120):'Estudiante',email:typeof payload.email==='string'?payload.email.slice(0,254):''};
 } catch { throw unauthorized(); }
}
export function safeOrigin(req) {
 const origin=req.headers.origin;
 const allowed=new Set(['https://angkor-academy.vercel.app','https://energia-alpha.vercel.app']);
 if(process.env.VERCEL_URL) allowed.add(`https://${process.env.VERCEL_URL}`);
 if(process.env.NODE_ENV!=='production')for(const origin of ['http://localhost:3000','http://localhost:3003','http://127.0.0.1:3003','http://localhost:3005','http://127.0.0.1:3005'])allowed.add(origin);
 return !!origin && allowed.has(origin);
}
