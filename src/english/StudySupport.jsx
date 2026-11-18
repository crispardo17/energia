import {useEffect,useState} from 'react';
import {Volume2,Square} from 'lucide-react';
import {courseApi} from './api';
import './learning.css';
const names={grammar:'Gramática',vocabulary:'Vocabulario',reading:'Lectura',listening:'Escucha'};
export default function StudySupport({courseId,onReview,refreshKey}){
 const[value,setValue]=useState(null),[status,setStatus]=useState(''),[busy,setBusy]=useState(false);
 useEffect(()=>{let live=true;courseApi(`learning&courseId=${encodeURIComponent(courseId)}`).then(v=>{if(live)setValue(v);}).catch(()=>{if(live)setStatus('No pudimos cargar tu plan. Vuelve a abrir el curso para intentarlo de nuevo.');});return()=>{live=false;};},[courseId,refreshKey]);
 useEffect(()=>{if(!value)return;document.documentElement.dataset.learningLarge=String(value.preferences.largeText);document.documentElement.dataset.learningSimple=String(value.preferences.simple);document.documentElement.dataset.audioRate=String(value.preferences.audioRate);return()=>{delete document.documentElement.dataset.learningLarge;delete document.documentElement.dataset.learningSimple;delete document.documentElement.dataset.audioRate;};},[value?.preferences]);
 async function change(key,v){const previous=value.preferences;const requested={...previous,[key]:v};setValue(old=>({...old,preferences:requested}));setBusy(true);setStatus('Guardando…');try{const result=await courseApi('preferences',{preferences:requested});setValue(old=>({...old,preferences:result.preferences}));setStatus('Preferencias guardadas en tu cuenta.');}catch(e){setValue(old=>({...old,preferences:previous}));setStatus(e.message);}finally{setBusy(false);}}
 const reviews=value?.reviews.filter(r=>r.course_id===courseId)||[];
 return <section className="study-support" aria-label="Tu plan de aprendizaje"><div><span className="learning-eyebrow">A TU RITMO</span><h2>Un paso claro. Una práctica útil.</h2><p>{value?`Hoy puedes dedicar ${value.preferences.minutes} minutos: recuerda algo anterior, practica una idea y comprueba qué entendiste.`:'Tu plan, tus ajustes y tus repasos se guardan con tu cuenta.'}</p><p>Equivocarte sirve para encontrar el próximo paso. Puedes repetir, escuchar y descansar sin perder lo aprendido.</p></div>{value&&<><details><summary>Ajustar cómo aprendo</summary><div className="learning-settings"><label><input type="checkbox" checked={value.preferences.largeText} disabled={busy} onChange={e=>change('largeText',e.target.checked)}/>Letra grande y lectura cómoda</label><label><input type="checkbox" checked={value.preferences.simple} disabled={busy} onChange={e=>change('simple',e.target.checked)}/>Empezar con explicaciones sencillas</label><label>Mi sesión de hoy<select value={value.preferences.minutes} disabled={busy} onChange={e=>change('minutes',Number(e.target.value))}><option value={5}>5 minutos</option><option value={10}>10 minutos</option><option value={20}>20 minutos</option></select></label><label>Velocidad de escucha<select value={value.preferences.audioRate} disabled={busy} onChange={e=>change('audioRate',Number(e.target.value))}><option value={0.7}>Muy tranquila</option><option value={0.85}>Tranquila</option><option value={1}>Normal</option></select></label></div><small>La duración es una sugerencia. La rapidez no da puntos ni se utiliza para decidir si sabes.</small></details><div className="learning-review-list"><h3>{reviews.length?'Tu repaso para hoy':'Preparado para tu siguiente paso'}</h3><p>{reviews.length?'Primero refuerza los errores; después recuerda lo que aprendiste hace unos días.':'Al completar ejercicios, organizaremos repasos según tus resultados. Puedes continuar con la siguiente lección.'}</p>{reviews.slice(0,3).map(r=><button key={r.lesson_id} onClick={()=>onReview(r.lesson_id)}><span>{r.title}<small>{r.concepts.map(c=>names[c]||c).join(' · ')}</small></span><strong>{r.remembered?'Recordar':'Reforzar'} →</strong></button>)}</div></>}<p role="status" className="learning-status">{status}</p></section>;
}
export function SpeakButton({text,language='es-ES',label='Escuchar explicación'}){
 const[status,setStatus]=useState(''),[playing,setPlaying]=useState(false);
 useEffect(()=>()=>{window.speechSynthesis?.cancel();},[]);
 function speak(){
  if(playing){window.speechSynthesis?.cancel();setPlaying(false);return;}
  if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){setStatus('Tu navegador no tiene lectura en voz alta. El texto sigue disponible.');return;}
  window.speechSynthesis.cancel();setStatus('');
  const utterance=new SpeechSynthesisUtterance(text);utterance.lang=language;
  const voices=window.speechSynthesis.getVoices();const voice=voices.find(v=>v.lang.toLowerCase().startsWith(language.slice(0,2)));
  if(voices.length&&!voice){setStatus('No hay una voz disponible para este idioma. Puedes seguir leyendo y usar los audios de la práctica.');return;}
  if(voice)utterance.voice=voice;utterance.rate=Number(document.documentElement.dataset.audioRate)||0.85;
  utterance.onstart=()=>setPlaying(true);utterance.onend=()=>setPlaying(false);
  utterance.onerror=event=>{setPlaying(false);if(!['canceled','interrupted'].includes(event.error))setStatus('No pudimos reproducir la voz. Puedes seguir leyendo.');};
  setPlaying(true);window.speechSynthesis.speak(utterance);
 }
 return <span className="speak-control"><button type="button" className="guide-audio-button" aria-pressed={playing} onClick={speak}>{playing?<Square size={16}/>:<Volume2 size={18}/>} {playing?'Detener lectura':label}</button>{status&&<small role="status">{status}</small>}</span>;
}
