import { a1ExamItems } from './a1-assessments.js';
import { forms } from './exam-content.js';
import { lessons } from './content.js';
import { addExamItems, q } from './assessment.js';
const items=[];
for (const [level,versions] of Object.entries(forms)) {
  if(level==='A1') continue;
  versions.forEach((f,v)=>{
    const mode=v?'review':'exam';
    const levelLessons=lessons.filter(l=>l.level===level);
    for(let i=0;i<2;i++){
      const l=levelLessons[i], prefix=`${level}-${mode}-${i}`;
      const [lp,lo,la]=f[1+i], [gp,go,ga]=f[3+i], [rp,ro,ra]=f[6+i];
      items.push(q(prefix+'l',l.id,'listening',lp,lo,la,`La grabación dice: ${f[0]}`,{mode,audio:`/audio/${level.toLowerCase()}-${mode}.wav`,transcript:f[0]}));
      items.push(q(prefix+'g',l.id,'grammar',gp,go,ga,`La respuesta correcta es: ${go[ga]}`,{mode}));
      items.push(q(prefix+'r',l.id,'reading',`${f[5]}\n\n${rp}`,ro,ra,`Busca la información o inferencia en el texto: ${f[5]}`,{mode}));
      // Context and distractors vary between the two forms.
      const vocabulary=v ? [l.meaning,'Una aprobación sin reservas','Una ubicación geográfica'] : ['Una acción contraria al ejemplo',l.meaning,'Un saludo informal'];
      items.push(q(prefix+'v',l.id,'vocabulary',`En el contexto “${l.example}”, ¿qué significa “${l.word}”?`,vocabulary,v?0:1,`En ese contexto significa: ${l.meaning}.`,{mode}));
    }
  });
}
addExamItems([...items,...a1ExamItems()]);
