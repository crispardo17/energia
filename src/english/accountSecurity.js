export function validEmail(value) {
 const email=value.trim();
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('Escribe un correo válido.');
 return email;
}
export function signInError(error) {
 const source=error?.error||error?.body||error;
 const code=source?.code||error?.code||'';
 const message=source?.message||error?.message||'';
 if(Number(source?.status||error?.status)>=500||/^NETWORK_|AUTH_UPSTREAM/.test(code))return new Error('El acceso no está disponible temporalmente. Intenta de nuevo.');
 if(['EMAIL_NOT_VERIFIED','EMAIL_VERIFICATION_REQUIRED','EMAIL_VERIFICATION_REQUIRED_TO_SIGN_IN'].includes(code)||/email verification required|email (?:is )?not verified|verify (?:your )?email/i.test(message)){
  return Object.assign(new Error('Verifica tu correo para ingresar.'),{code:'EMAIL_NOT_VERIFIED'});
 }
 if(source?.status===429||error?.status===429||/TOO_MANY|RATE_LIMIT/.test(code))return new Error('Demasiados intentos. Espera antes de volver a ingresar.');
 return new Error('Correo o contraseña incorrectos.');
}
export function sessionError(error,oauthReturn=false){
 const source=error?.error||error?.body||error;
 const status=Number(source?.status||error?.status||0);
 if(oauthReturn&&status>=400&&status<500)return Object.assign(new Error('No pudimos confirmar el regreso desde Google. Pulsa Continuar con Google para intentarlo de nuevo.'),{code:'OAUTH_CALLBACK_FAILED'});
 return new Error('No pudimos comprobar tu sesión. Revisa la conexión e intenta ingresar de nuevo.');
}
export function validPassword(password,confirmation) {
 if(password.length<8||password.length>128)throw new Error('Usa una contraseña de 8 a 128 caracteres.');
 if(password!==confirmation)throw new Error('Las contraseñas no coinciden.');
}
function check(result) {
 if(result.error){
  const code=result.error.code||'';
  if(result.error.status===429||/TOO_MANY|RATE_LIMIT/.test(code))throw new Error('Demasiados intentos. Espera antes de volver a intentarlo o solicita un nuevo código.');
  throw new Error('No pudimos completar la operación. Revisa el código y su vigencia o solicita uno nuevo.');
 }
 return result.data;
}
export function accountSecurity(getClient) {
 return {
  async sendCode(email,purpose) {
   email=validEmail(email);
   if(!['verify','reset'].includes(purpose))throw new Error('Operación inválida.');
   const client=await getClient();
   const result=purpose==='reset'?await client.forgetPassword.emailOtp({email}):await client.emailOtp.sendVerificationOtp({email,type:'email-verification'});
   // Both known and unknown addresses get the same UI message.
   if(result.error&&!['USER_NOT_FOUND','EMAIL_NOT_FOUND'].includes(result.error.code))check(result);
  },
  async verify(email,otp) {
   email=validEmail(email);otp=otp.trim();
   if(!/^\d{6}$/.test(otp))throw new Error('Escribe el código de 6 dígitos que recibiste.');
   const client=await getClient();return check(await client.emailOtp.verifyEmail({email,otp}));
  },
  async reset(email,otp,password,confirmation) {
   email=validEmail(email);validPassword(password,confirmation);otp=otp.trim();
   if(!/^\d{6}$/.test(otp))throw new Error('Escribe el código de 6 dígitos que recibiste.');
   const client=await getClient();return check(await client.emailOtp.resetPassword({email,otp,password}));
  }
 };
}
