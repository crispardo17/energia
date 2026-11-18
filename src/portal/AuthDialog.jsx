import { useState } from 'react';
import { X,ArrowRight,Eye,EyeOff } from 'lucide-react';
import { emailSignIn,emailSignUp,signIn,session,security } from '../english/api';
export default function AuthDialog({onClose,onComplete,initialMode='signin',initialError=''}){
 const[mode,setMode]=useState(initialMode),[name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[confirmation,setConfirmation]=useState('');
 const[busy,setBusy]=useState(false),[error,setError]=useState(initialError),[message,setMessage]=useState(''),[show,setShow]=useState(false);
 const[otp,setOtp]=useState(''),[sent,setSent]=useState(false),[resendAt,setResendAt]=useState(0);
 const recovery=mode==='reset',verification=mode==='verify',codeMode=recovery||verification;
 const swap=m=>{setMode(m);setError('');setMessage('');setPassword('');setConfirmation('');setOtp('');setSent(false);setShow(false);};
 async function sendCode(){
  if(Date.now()<resendAt)throw new Error('Espera un minuto antes de solicitar otro código.');
  await security.sendCode(email,recovery?'reset':'verify');setSent(true);setOtp('');setResendAt(Date.now()+60000);
  setMessage('Si el correo corresponde a una cuenta, recibirás un código. Revisa también la carpeta de spam.');
 }
 async function resend(){setBusy(true);setError('');try{await sendCode();}catch(e){setError(e.message);}finally{setBusy(false);}}
 async function submit(e){e.preventDefault();setBusy(true);setError('');setMessage('');try{
  if(codeMode){
   if(!sent&&!verification){await sendCode();return;}
   if(recovery){await security.reset(email,otp,password,confirmation);swap('signin');setMessage('Contraseña actualizada. Tus sesiones anteriores se cerraron. Ingresa con tu nueva contraseña.');return;}
   await security.verify(email,otp);const current=await session();
   if(current?.user){await onComplete(current.user);}else{swap('signin');setMessage('Correo verificado. Ya puedes ingresar.');}return;
  }
  if(mode==='signup'){
   const created=await emailSignUp({name,email,password,confirmation});
   if(!created?.token){swap('verify');setSent(true);setResendAt(Date.now()+60000);setMessage('Revisa tu correo e ingresa el código para activar tu cuenta.');return;}
  }else await emailSignIn(email,password);
  const current=await session();
  if(current?.user){await onComplete(current.user);}else{swap('signin');setMessage('Ingresa para continuar.');}
 }catch(e){if(e.code==='EMAIL_NOT_VERIFIED'){swap('verify');setMessage('Revisa el correo que recibiste e introduce aquí el código de 6 dígitos. Si no lo tienes o caducó, puedes solicitar otro.');}else setError(e.message);}finally{setBusy(false);}}
 async function google(){setBusy(true);setError('');try{await signIn();}catch(e){setError(e.message);}finally{setBusy(false);}}
 return <div className="portal-overlay"><section className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title" onKeyDown={e=>{if(e.key==='Escape'&&!busy)onClose();if(e.key==='Tab'){const all=[...e.currentTarget.querySelectorAll('button:not(:disabled),input:not(:disabled)')],first=all[0],last=all[all.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}}>
  <button className="portal-icon close-dialog" onClick={onClose} disabled={busy} aria-label="Cerrar acceso"><X size={20}/></button><div className="portal-kicker">ANGKOR ACADEMY</div><h2 id="auth-title">{recovery?'Recupera tu contraseña.':verification?'Verifica tu correo.':mode==='signup'?'Tu próximo capítulo empieza aquí.':'Qué bueno verte de nuevo.'}</h2><p>{codeMode?'Usa el código que recibas en tu correo. Nunca lo compartas.':'Una cuenta para tus cursos, resultados y próximos objetivos.'}</p>
  <div className="auth-tabs"><button onClick={()=>swap('signin')} className={mode==='signin'?'active':''} disabled={busy}>Ingresar</button><button onClick={()=>swap('signup')} className={mode==='signup'?'active':''} disabled={busy}>Crear cuenta</button></div>
  {!codeMode&&<button className="portal-link verification-entry" disabled={busy} onClick={()=>swap('verify')}>Ya tengo un código de verificación</button>}
  {!codeMode&&<><button className="google-auth" onClick={google} disabled={busy}><span aria-hidden="true">G</span>Continuar con Google</button><div className="auth-divider"><span>o con tu correo</span></div></>}
  <form onSubmit={submit}>{mode==='signup'&&<label>Nombre completo<input autoFocus autoComplete="name" value={name} onChange={e=>setName(e.target.value)} required minLength={2} maxLength={120} disabled={busy}/></label>}
   <label>Correo electrónico<input autoFocus={mode==='signin'} type="email" autoComplete="email" value={email} onChange={e=>{setEmail(e.target.value);if(codeMode){setSent(false);setOtp('');setMessage('');}}} required maxLength={254} disabled={busy}/></label>
   {codeMode&&(sent||verification)&&<label>Código de verificación<input autoFocus inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="Escribe los 6 dígitos del correo" pattern="[0-9]{6}" maxLength={12} minLength={6} required disabled={busy}/></label>}
   {(!codeMode||(recovery&&sent))&&<label>{recovery?'Nueva contraseña':'Contraseña'}<div className="password-field"><input aria-label="Contraseña" type={show?'text':'password'} autoComplete={mode==='signup'||recovery?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)} required minLength={mode==='signin'?1:8} maxLength={128} disabled={busy}/><button type="button" className="portal-icon" aria-label={show?'Ocultar contraseña':'Mostrar contraseña'} onClick={()=>setShow(!show)} disabled={busy}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>}
   {(mode==='signup'||(recovery&&sent))&&<><small className="password-hint">Entre 8 y 128 caracteres. Usa una contraseña que no utilices en otro sitio.</small><label>Repite tu contraseña<input type={show?'text':'password'} autoComplete="new-password" value={confirmation} onChange={e=>setConfirmation(e.target.value)} required maxLength={128} disabled={busy}/></label></>}
   {error&&<div className="portal-error" role="alert">{error}</div>}{message&&<div className="portal-success" role="status">{message}</div>}
   <button className="portal-button auth-submit" disabled={busy}>{busy?'Un momento…':verification?'Verificar correo':recovery?!sent?'Enviar código':'Guardar nueva contraseña':mode==='signup'?'Crear mi cuenta':'Ingresar'}<ArrowRight size={17}/></button>
  </form><div className="account-security-actions">{mode==='signin'&&<><button className="portal-link" disabled={busy} onClick={()=>swap('reset')}>Olvidé mi contraseña</button></>}{codeMode&&<>{(sent||verification)&&<button className="portal-link" disabled={busy} onClick={resend}>Solicitar otro código</button>}<button className="portal-link" disabled={busy} onClick={()=>swap('signin')}>Volver a ingresar</button></>}</div><p className="auth-note">Tu contraseña se protege mediante el servicio de autenticación. La confirmación no se guarda. Tu progreso queda asociado a tu cuenta.</p>
 </section></div>;
}
