import { createAuthClient } from '@neon/auth';
import { BetterAuthReactAdapter } from '@neon/auth/react/adapters';
import { accountSecurity,signInError,sessionError } from './accountSecurity.js';
export const security=accountSecurity(getAuth);
let auth;
export async function getAuth() {
 if(!auth) {
  auth=createAuthClient(window.location.origin+'/api/session',{adapter:BetterAuthReactAdapter({fetchOptions:{credentials:'same-origin'}})});
 }
 return auth;
}
let sessionRequest;
export async function session(){
 if(!sessionRequest)sessionRequest=readSession().finally(()=>{sessionRequest=undefined;});
 return sessionRequest;
}
async function readSession(){
 const client=await getAuth();
 const oauthReturn=new URLSearchParams(window.location.search).has('neon_auth_session_verifier');
 try{
  const {data,error}=await client.getSession();
  if(error)throw error;
  if(oauthReturn&&!data?.user)throw {status:400};
  return data;
 }catch(error){
  const failure=sessionError(error,oauthReturn);
  if(failure.code==='OAUTH_CALLBACK_FAILED'){
   const url=new URL(window.location.href);url.searchParams.delete('neon_auth_session_verifier');window.history.replaceState(window.history.state,'',url.href);
  }
  throw failure;
 }
}
export async function api(action,body) {
 const data=await session();
 const token=data?.session?.token||data?.session?.access_token;
 if(!token) throw new Error('Inicia sesión con Google para guardar tu progreso.');
 const response=await fetch(`/api/academy${body?'':`?action=${action}`}`,{
  method:body?'POST':'GET',headers:{Authorization:`Bearer ${token}`,'X-Session-Id':data.session.id,...(body?{'Content-Type':'application/json'}:{})},
  ...(body?{body:JSON.stringify({...body,action})}:{})
 });
 const result=await response.json();
 if(!response.ok) throw new Error(result.error||'No pudimos completar la operación.');
 return result;
}
export async function signIn() {
 const client=await getAuth();
 const result=await client.signIn.social({provider:'google',callbackURL:window.location.origin,errorCallbackURL:window.location.origin+'/?auth_error=1'});
 if(result.error) throw new Error('No pudimos abrir Google. Revisa la conexión o intenta de nuevo más tarde.');
}
export async function signOut() {
 const client=await getAuth();const result=await client.signOut();
 if(result.error) throw new Error('No pudimos cerrar tu sesión. Intenta de nuevo.');
}
export async function emailSignIn(email,password){
 const client=await getAuth();let result;
 try{result=await client.signIn.email({email:email.trim(),password});}catch(error){throw signInError(error);}
 if(result.error)throw signInError(result.error);
 return result.data;
}
export async function emailSignUp({name,email,password,confirmation}){
 if(name.trim().length<2)throw new Error('Escribe tu nombre (al menos dos caracteres).');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))throw new Error('Escribe un correo válido.');
 if(password.length<8||password.length>128)throw new Error('Usa una contraseña de 8 a 128 caracteres.');
 if(password!==confirmation)throw new Error('Las contraseñas no coinciden.');
 const client=await getAuth();const result=await client.signUp.email({name:name.trim(),email:email.trim(),password});
 if(result.error)throw new Error('No pudimos crear la cuenta. Revisa los datos o inicia sesión si ya te registraste.');
 return result.data;
}
export async function courseApi(action,body){
 const data=await session();const token=data?.session?.token||data?.session?.access_token;
 if(!token)throw new Error('Ingresa con Google o con tu correo y contraseña.');
 const response=await fetch(`/api/courses${body?'':`?action=${action}`}`,{method:body?'POST':'GET',headers:{Authorization:`Bearer ${token}`,'X-Session-Id':data.session.id,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify({...body,action})}:{})});
 const value=await response.json();if(!response.ok)throw new Error(value.error||'No pudimos completar la operación.');return value;
}
export async function courseLesson(id){
 const data=await session(),token=data?.session?.token||data?.session?.access_token;
 const r=await fetch(`/api/courses?action=lesson&id=${encodeURIComponent(id)}`,{headers:{Authorization:`Bearer ${token}`,'X-Session-Id':data?.session?.id||''}});
 const value=await r.json();if(!r.ok)throw new Error(value.error||'No pudimos abrir la sesión.');return value;
}
