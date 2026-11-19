const preferenceKey='angkor-feedback-sounds';
let context;
let fallbackEnabled=true;
const active=new Set();
export function soundsEnabled(){try{return localStorage.getItem(preferenceKey)!=='off';}catch{return fallbackEnabled;}}
export function stopFeedbackSound(){for(const oscillator of active){try{oscillator.stop();}catch{}}active.clear();}
export function setSoundsEnabled(enabled){
 fallbackEnabled=enabled;
 try{localStorage.setItem(preferenceKey,enabled?'on':'off');}catch{}
 if(!enabled)stopFeedbackSound();
 window.dispatchEvent(new Event('angkor-feedback-sounds'));
}
export async function playFeedbackSound(correct){
 try{
  if(!soundsEnabled())return;
  const Audio=window.AudioContext||window.webkitAudioContext;
  if(!Audio)return;
  if(!context||context.state==='closed')context=new Audio();
  if(context.state==='suspended')await context.resume();
  if(!soundsEnabled()||context.state!=='running')return;
  stopFeedbackSound();
  const start=context.currentTime;
  (correct?[660,880]:[330,262]).forEach((frequency,index)=>{
   const oscillator=context.createOscillator(),gain=context.createGain();
   const time=start+index*0.13;
   oscillator.type='sine';oscillator.frequency.setValueAtTime(frequency,time);
   gain.gain.setValueAtTime(0,time);
   gain.gain.linearRampToValueAtTime(0.055,time+0.015);
   gain.gain.exponentialRampToValueAtTime(0.001,time+0.14);
   oscillator.connect(gain);gain.connect(context.destination);active.add(oscillator);
   oscillator.onended=()=>{active.delete(oscillator);oscillator.disconnect();gain.disconnect();};
   oscillator.start(time);oscillator.stop(time+0.16);
  });
 }catch{/* Visual feedback remains available if audio is unsupported or blocked. */}
}
