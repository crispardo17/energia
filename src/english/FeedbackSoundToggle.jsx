import {useEffect,useState} from 'react';
import {Volume2,VolumeX} from 'lucide-react';
import {soundsEnabled,setSoundsEnabled} from './feedbackSound';
import './feedback-sound.css';
export default function FeedbackSoundToggle(){
 const[enabled,setEnabled]=useState(soundsEnabled);
 useEffect(()=>{const update=()=>setEnabled(soundsEnabled());window.addEventListener('angkor-feedback-sounds',update);window.addEventListener('storage',update);return()=>{window.removeEventListener('angkor-feedback-sounds',update);window.removeEventListener('storage',update);};},[]);
 return <button type="button" className="feedback-sound-toggle" aria-label="Sonidos de respuesta" aria-pressed={enabled} title={enabled?'Silenciar sonidos de acierto y error':'Activar sonidos de acierto y error'} onClick={()=>setSoundsEnabled(!enabled)}>{enabled?<Volume2 size={17}/>:<VolumeX size={17}/>}<span>Sonido {enabled?'activado':'desactivado'}</span></button>;
}
