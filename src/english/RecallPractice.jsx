import {useState} from 'react';
import {ArrowRight,Check,Lightbulb,RotateCcw} from 'lucide-react';
import {normalizeRecall,recallActivities} from './recallActivities';
import {playFeedbackSound} from './feedbackSound';
import FeedbackSoundToggle from './FeedbackSoundToggle';
export default function RecallPractice({lesson,technical=false,conceptIndex=0}){
 const activities=recallActivities(lesson,technical,conceptIndex);
 const [round,setRound]=useState(0),[selected,setSelected]=useState(null),[ordered,setOrdered]=useState([]),[checked,setChecked]=useState(false),[hint,setHint]=useState(false),[writing,setWriting]=useState(false),[answer,setAnswer]=useState('');
 const activity=activities[round];
 if(!activity)return null;
 const correct=activity.type==='order'?ordered.length===activity.answer.length&&ordered.every((id,i)=>id===activity.answer[i]):writing?normalizeRecall(answer)===normalizeRecall(activity.options.find(o=>o.id===activity.answer)?.text):selected===activity.answer;
 function confirm(){setChecked(true);playFeedbackSound(correct);}
 function reset(nextRound=round){setRound(nextRound);setSelected(null);setOrdered([]);setChecked(false);setHint(false);setAnswer('');setWriting(false);}
 return <div className="recall-practice">
  <div className="recall-practice-top"><span>Juega a recordar</span><small>Reto {round+1} de {activities.length}</small><FeedbackSoundToggle/></div>
  <fieldset><legend>{activity.prompt}</legend><p className="recall-context" lang={activity.contextLanguage}>{activity.context}</p>
  {activity.type==='choice'?<>
   {!writing?<div className="recall-options">{activity.options.map((option,i)=><button type="button" key={option.id} lang={activity.language} aria-pressed={selected===option.id} onClick={()=>{setSelected(option.id);setChecked(true);playFeedbackSound(option.id===activity.answer);}}><span className="recall-option-number" aria-hidden="true">{String.fromCharCode(65+i)}</span><span>{option.text}</span>{checked&&selected===option.id&&correct&&<Check size={19} aria-hidden="true"/>}</button>)}</div>:<form onSubmit={e=>{e.preventDefault();confirm();}}><label>Tu respuesta<input value={answer} lang={activity.language} autoComplete="off" required onChange={e=>{setAnswer(e.target.value);setChecked(false);}}/></label><button className="recall-check" type="submit">Comprobar</button></form>}
   {!technical&&<button className="recall-text-action" type="button" onClick={()=>{setWriting(!writing);setChecked(false);setSelected(null);setAnswer('');}}>{writing?'Volver a las opciones':'Intentar sin opciones'}</button>}
  </>:<>
   <ol className="recall-sequence" aria-label="Tu recorrido">{ordered.map((id,i)=><li key={id}><span>{i+1}</span>{activity.options.find(o=>o.id===id).text}</li>)}</ol>
   {!ordered.length&&<p className="recall-empty">Tu recorrido aparecerá aquí.</p>}
   <div className="recall-options">{activity.options.filter(o=>!ordered.includes(o.id)).map(option=><button type="button" key={option.id} onClick={()=>{setOrdered([...ordered,option.id]);setChecked(false);}}><span aria-hidden="true">＋</span><span>{option.text}</span></button>)}</div>
   <div className="recall-tools"><button type="button" disabled={!ordered.length} onClick={()=>{setOrdered(ordered.slice(0,-1));setChecked(false);}}>Deshacer</button><button className="recall-check" type="button" disabled={ordered.length!==activity.answer.length} onClick={confirm}>Comprobar recorrido</button></div>
  </>}
  </fieldset>
  {checked&&<div className={`recall-result ${correct?'recall-correct':''}`} role="status"><strong>{correct?'¡Bien! Encontraste la relación.':'Vamos a verlo juntos.'}</strong><p>{activity.explanation}</p>{!correct&&<span>Puedes cambiar tu respuesta y volver a probar.</span>}</div>}
  <div className="recall-tools"><button type="button" className="recall-text-action" aria-expanded={hint} onClick={()=>setHint(!hint)}><Lightbulb size={17}/>{hint?'Ocultar pista':'Dame una pista'}</button>{checked&&round<activities.length-1&&<button type="button" className="recall-check" onClick={()=>reset(round+1)}>Siguiente reto<ArrowRight size={17}/></button>}{round===activities.length-1&&checked&&<button type="button" className="recall-text-action" onClick={()=>reset(0)}><RotateCcw size={16}/>Repetir los retos</button>}</div>
  {hint&&<p className="recall-hint">{activity.type==='order'?`Empieza por: ${activity.options.find(o=>o.id===activity.answer[0]).text}.`:technical?lesson.body.analogy:`La respuesta empieza con «${activity.options.find(o=>o.id===activity.answer)?.text.slice(0,2)}». Piensa en el significado antes de elegir.`}</p>}
  <small className="recall-personal">Practica sin límite de tiempo. Este repaso no cambia tu nota; la comprobación viene después.</small>
 </div>;
}
