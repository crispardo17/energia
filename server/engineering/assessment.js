import { randomInt } from 'node:crypto';
export const shuffle=values=>{const a=[...values];for(let i=a.length-1;i>0;i--){const j=randomInt(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
export function prepareQuestions(source){return shuffle(source).map(q=>{
 const order=shuffle(q.options.map((_,i)=>i));
 return {...q,options:order.map(i=>q.options[i]),answer:q.type==='order'?q.answer.map(i=>order.indexOf(i)):order.indexOf(q.answer)};
});}
export function safeQuestions(questions){return questions.map(({answer,why,...q})=>q);}
export function gradeEngineering(questions,answers){
 if(!Array.isArray(answers)||answers.length!==questions.length)throw Object.assign(new Error('Responde todos los ejercicios.'),{status:400});
 const feedback=questions.map((q,i)=>{
  const value=answers[i];let correct=false;
  if(q.type==='order'){
   if(!Array.isArray(value)||value.length!==q.options.length||new Set(value).size!==q.options.length||value.some(v=>!Number.isInteger(v)||v<0||v>=q.options.length))throw Object.assign(new Error('Completa el orden de todos los pasos.'),{status:400});
   correct=value.every((v,j)=>v===q.answer[j]);
  }else{
   if(!Number.isInteger(value)||value<0||value>=q.options.length)throw Object.assign(new Error('Selecciona una respuesta válida.'),{status:400});
   correct=value===q.answer;
  }
  return {...q,selected:value,correct};
 });
 const correct=feedback.filter(f=>f.correct).length,percent=Math.round(correct/questions.length*100);
 const criticalErrors=feedback.filter(f=>f.critical&&!f.correct).map(f=>f.concept);
 const application=feedback.filter(q=>q.application);
 const applicationPassed=application.length>=2&&application.every(q=>q.correct);
 return {percent,correct,total:questions.length,applicationPassed,applicationCorrect:application.filter(q=>q.correct).length,applicationTotal:application.length,quizPassed:percent>=85&&!criticalErrors.length&&applicationPassed,criticalErrors,
  reinforce:[...new Set(feedback.filter(f=>!f.correct).map(f=>f.concept))],feedback};
}
export function engineeringState(lessons,attempts){
 const passed=new Set(lessons.filter(l=>attempts.some(a=>a.lesson_id===l.id&&(a.version===l.version||a.version==='engineering-2026-11-v1')&&a.status==='approved')).map(l=>l.id));
 return lessons.map((lesson,i)=>({id:lesson.id,accessible:lessons.slice(0,i).every(l=>passed.has(l.id)),approved:passed.has(lesson.id),
  status:attempts.find(a=>a.lesson_id===lesson.id&&a.version===lesson.version)?.status||'not_started'}));
}
