export const normalizeRecall=value=>String(value).normalize('NFKC').toLocaleLowerCase('en').trim().replace(/[.!?,;:]/g,'').replace(/\s+/g,' ');

// Stable ordering keeps React renders predictable without always placing the answer first.
function mix(items,seed){
 const score=value=>{let hash=2166136261;for(const c of `${seed}:${value}`)hash=Math.imul(hash^c.charCodeAt(0),16777619);return hash>>>0;};
 return [...items].sort((a,b)=>score(a.id)-score(b.id));
}
function choice(prompt,context,pairs,answer,explanation,seed,language){
 const unique=[...new Map(pairs.map(([id,text])=>[normalizeRecall(text),{id,text}])).values()];
 return {type:'choice',prompt,context,options:mix(unique,seed),answer,explanation,language};
}
export function recallActivities(lesson,technical,conceptIndex=0){
 const seed=`${lesson.id}:${conceptIndex}`;
 if(technical){
  const concepts=lesson.body.concepts,concept=concepts[conceptIndex];
  const identify=choice('¿Qué idea describe esta pista?',concept.explanation,concepts.map((c,i)=>[String(i),c.name]),String(conceptIndex),`Esta es la idea de «${concept.name}». ${concept.explanation}`,seed,'es');
  const steps=lesson.body.flow.map((text,i)=>({id:String(i),text}));
  if(conceptIndex<concepts.length-1)return [identify];
  return [identify,{type:'order',prompt:'Reconstruye el recorrido del ejemplo',context:'Toca primero lo que ocurre al inicio y continúa hasta el resultado.',options:mix(steps,seed),answer:steps.map(s=>s.id),explanation:`El recorrido del ejemplo es: ${steps.map(s=>s.text).join(' → ')}.`}];
 }
 const words=(lesson.words||[{word:lesson.word,meaning:lesson.meaning}]).filter(w=>w.word&&w.meaning);
 if(!words.length)return [];
 return words.map((word,index)=>index%2===0?
  choice(`¿Cómo dices «${word.meaning}» en inglés?`,'Elige una palabra de esta lección.',words.map(w=>[w.word,w.word]),word.word,`${word.word} significa «${word.meaning}».`,seed+':'+index,'en'):
  {...choice('Ahora cambia de dirección: ¿qué significa esta palabra?',word.word,words.map(w=>[w.meaning,w.meaning]),word.meaning,`${word.word} significa «${word.meaning}».`,seed+':'+index,'es'),contextLanguage:'en'}
 );
}
