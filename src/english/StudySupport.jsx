import {useEffect,useState} from 'react';
import {Volume2,Square} from 'lucide-react';
import {courseApi} from './api';
import './learning.css';
const names={grammar:'Gramática',vocabulary:'Vocabulario',reading:'Lectura',listening:'Escucha'};
export default function StudySupport({courseId,onReview,refreshKey}){
 const[value,setValue]=useState(null),[status,setStatus]=useState('');
 useEffect(()=>{let live=true;courseApi(`learning&courseId=${encodeURIComponent(courseId)}`).then(v=>{if(live)setValue(v);}).catch(()=>{if(live)setStatus('No pudimos cargar tus repasos. Vuelve a abrir el curso para intentarlo de nuevo.');});return()=>{live=false;};},[courseId,refreshKey]);
 useEffect(()=>{if(!value)return;document.documentElement.dataset.audioRate=String(value.preferences.audioRate);return()=>{delete document.documentElement.dataset.audioRate;};},[value?.preferences.audioRate]);
 const reviews=value?.reviews.filter(r=>r.course_id===courseId)||[];
 if(!reviews.length&&!status)return null;
 return <section className="study-support" aria-label="Tus repasos pendientes">
  {reviews.length>0&&<div className="learning-review-list"><h3>Tus repasos pendientes</h3><p>Vuelve a practicar lo que necesita refuerzo, a tu ritmo.</p>{reviews.slice(0,3).map(r=><button key={r.lesson_id} onClick={()=>onReview(r.lesson_id)}><span>{r.title}<small>{r.concepts.map(c=>c.startsWith('word:')?'Palabra: '+c.slice(5):names[c]||c).join(' · ')}</small></span><strong>{r.remembered?'Recordar':'Reforzar'} →</strong></button>)}</div>}
  {status&&<p role="status" className="learning-status">{status}</p>}
 </section>;
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
