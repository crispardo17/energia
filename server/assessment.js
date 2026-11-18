import { randomInt } from 'node:crypto';
import { levels, lessons, units } from './content.js';
import { listening } from './listening.js';
export const POLICY = { version: '2026-11-18-a1-v2', practice: 80, exam: 85, skill: 75, retentionHours: 24, retryMinutes: 15 };
export const SKILLS = { grammar: 'Gramática', vocabulary: 'Vocabulario', reading: 'Lectura', listening: 'Escucha' };
const shuffled = list => { const a = [...list]; for(let i=a.length-1;i>0;i--){const j=randomInt(i+1);[a[i],a[j]]=[a[j],a[i]];} return a; };
const q = (id, lessonId, skill, prompt, options, answer, why, extra = {}) => ({id, lessonId, skill, prompt, options, answer, why, ...extra});
// Practice answers and assessment rubrics live on the server, never in the public bundle.
export const bank = lessons.flatMap(l => {
  if(l.level==='A1') {
    const extra={mode:'practice',unitId:l.unitId};
    return [
      ...l.grammar.slice(0,2).map((g,i)=>q(`${l.id}-pg${i}`,l.id,'grammar',g.prompt,g.options,g.answer,g.why,extra)),
      ...l.words.slice(0,2).map((w,i)=>q(`${l.id}-pv${i}`,l.id,'vocabulary',`¿Qué significa “${w.word}”?`,[w.meaning,...l.words.filter(v=>v!==w).slice(0,2).map(v=>v.meaning)],0,`“${w.word}” significa ${w.meaning}.`,extra)),
      ...l.reading.questions.map((r,i)=>q(`${l.id}-pr${i}`,l.id,'reading',`${l.reading.text}\n\n${r.prompt}`,r.options,r.answer,`Vuelve al texto: ${l.reading.text}`,extra)),
      ...l.audio.questions.map((a,i)=>q(`${l.id}-pl${i}`,l.id,'listening',a.prompt,a.options,a.answer,`La grabación dice: ${l.audio.text}`,{...extra,audio:`/audio/${l.id}.wav`,transcript:l.audio.text})),
    ];
  }
  const [transcript,prompt,options,answer,why] = listening[l.id];
  return [
    ...l.questions.map((x,i) => q(`${l.id}-p${i}`,l.id,i===0?'grammar':'vocabulary',x.prompt,x.options,x.answer,x.why,{mode:'practice'})),
    q(`${l.id}-pr`,l.id,'reading',`Lee: “${l.example}”. ¿Qué expresa?`,[l.translation,'Una acción que el texto no menciona','Una cantidad sin contexto'],0,`La frase significa: ${l.translation}`,{mode:'practice'}),
    q(`${l.id}-pl`,l.id,'listening',prompt,options,answer,why,{mode:'practice',audio:`/audio/${l.id}.wav`,transcript}),
  ];
});
export function publicLesson(l) {
  const {questions,grammar,reading,audio,...content}=l;
  return {...content,audio:`/audio/${l.id}.wav`};
}
export function levelState(attempts, now = Date.now()) {
  let unlocked = 0;
  const states = levels.map((level,index) => {
    const items=attempts.filter(a => a.level===level.id && a.submitted_at);
    const required=lessons.filter(l=>l.level===level.id);
    const completed=required.filter(l=>items.some(a=>a.kind==='practice' && a.lesson_id===l.id && a.passed));
    const exam=items.filter(a=>a.kind==='exam' && a.passed && completed.length===required.length && (level.id!=='A1'||a.policy_version===POLICY.version)).sort((a,b)=>new Date(a.submitted_at)-new Date(b.submitted_at))[0];
    const review=items.some(a=>a.kind==='review' && a.passed && (level.id!=='A1'||a.policy_version===POLICY.version) && exam && new Date(a.submitted_at)-new Date(exam.submitted_at)>=POLICY.retentionHours*3600000);
    const accessible=index===0 || index<=unlocked;
    if(accessible && review) unlocked=index+1;
    const reviewAt=exam ? new Date(new Date(exam.submitted_at).getTime()+POLICY.retentionHours*3600000).toISOString() : null;
    const lastAssessment=items.filter(a=>a.kind!=='practice').sort((a,b)=>new Date(b.submitted_at)-new Date(a.submitted_at))[0];
    const retryAt=lastAssessment && !lastAssessment.passed ? new Date(new Date(lastAssessment.submitted_at).getTime()+POLICY.retryMinutes*60000).toISOString() : null;
    return {id:level.id,accessible,completed:completed.map(l=>l.id),total:required.length,examPassed:!!exam,reviewPassed:review,reviewAt,retryAt,readyForExam:accessible && completed.length===required.length,readyForReview:accessible && !!reviewAt && now>=Date.parse(reviewAt)};
  });
  return states;
}
export function assertAccess({kind,lessonId,level}, attempts, now=Date.now()) {
  if(!['practice','exam','review'].includes(kind)) throw Object.assign(new Error('Tipo de evaluación inválido.'),{status:400});
  const lesson=lessons.find(l=>l.id===lessonId);
  if(kind==='practice' && !lesson) throw Object.assign(new Error('Lección no encontrada.'),{status:404});
  const id=kind==='practice'?lesson.level:level;
  const state=levelState(attempts,now).find(s=>s.id===id);
  const fail=message=>{throw Object.assign(new Error(message),{status:403});};
  if(!state?.accessible) fail('Completa la evaluación y el repaso del nivel anterior.');
  if(kind==='practice' && lesson.unitNumber>1) {
    const earlier=lessons.filter(l=>l.level===id && l.unitNumber<lesson.unitNumber);
    if(earlier.some(l=>!state.completed.includes(l.id))) fail('Completa las lecciones de las unidades anteriores para abrir esta unidad.');
  }
  if(kind!=='practice' && state.retryAt && now<Date.parse(state.retryAt)) fail('Repasa tus errores. Podrás repetir la evaluación en 15 minutos.');
  if(kind==='exam' && !state.readyForExam) fail('Primero aprueba todas las lecciones de este nivel.');
  if(kind==='review' && !state.readyForReview) fail('El repaso se habilita 24 horas después de aprobar la evaluación.');
  return {level:id,lessonId:kind==='practice'?lesson.id:null};
}
export function createQuestions({kind,lessonId,level}) {
  let source=kind==='practice' ? bank.filter(q=>q.mode==='practice' && q.lessonId===lessonId) : examBank.filter(q=>q.mode===(kind==='review'?'review':'exam') && lessons.find(l=>l.id===q.lessonId)?.level===level);
  if(kind!=='practice' && level==='A1') source=units.flatMap(unit=>Object.keys(SKILLS).map(skill=>shuffled(source.filter(q=>q.unitId===unit.id&&q.skill===skill))[0]));
  if(!source.length||source.some(q=>!q)) throw new Error('No hay preguntas publicadas para esta evaluación.');
  return shuffled(source).map(item=>{
    const order=shuffled(item.options.map((_,i)=>i));
    return {...item,options:order.map(i=>item.options[i]),answer:order.indexOf(item.answer)};
  });
}
export function publicQuestions(questions) { return questions.map(({answer,why,transcript,mode,...q})=>q); }
export function grade(questions,answers,kind) {
  if(!Array.isArray(answers)||answers.length!==questions.length||answers.some((a,i)=>!Number.isInteger(a)||a<0||a>=questions[i].options.length)) throw Object.assign(new Error('Responde todas las preguntas.'),{status:400});
  const skills={},unitResults={}; let correct=0;
  const feedback=questions.map((q,i)=>{ const ok=answers[i]===q.answer;correct+=Number(ok); skills[q.skill]??={correct:0,total:0};skills[q.skill].total++;skills[q.skill].correct+=Number(ok);if(q.unitId){unitResults[q.unitId]??={correct:0,total:0};unitResults[q.unitId].total++;unitResults[q.unitId].correct+=Number(ok);}return {id:q.id,prompt:q.prompt,selected:answers[i],options:q.options,correct:ok,answer:q.answer,why:q.why,transcript:q.transcript,skill:q.skill}; });
  for(const stat of Object.values(skills)) stat.percent=Math.round(stat.correct/stat.total*100);
  for(const stat of Object.values(unitResults)) stat.percent=Math.round(stat.correct/stat.total*100);
  const percent=Math.round(correct/questions.length*100);
  const passed=percent>=(kind==='practice'?POLICY.practice:POLICY.exam) && Object.values(skills).every(s=>s.percent>=POLICY.skill) && Object.values(unitResults).every(s=>s.percent>=POLICY.skill);
  return {correct,total:questions.length,percent,passed,skills,units:unitResults,feedback};
}
// Independent assessment items: none reuse the practice prompts or listening scripts.
export const examBank = [];
export function addExamItems(items) { examBank.push(...items); }
export { q };
