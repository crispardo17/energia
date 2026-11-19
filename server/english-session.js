import {conversationFor} from './english-conversation.js';
// Reusable verb practice: forms are attached to contextual examples, never to
// invented learner history. The last verb of each set revisits earlier material.
const source=`be|ser o estar|/biː/|was|been|ready
have|tener|/hæv/|had|had|time to learn
 do|hacer|/duː/|did|done|the exercise
 go|ir|/ɡəʊ/|went|gone|to the library
 get|obtener|/ɡet/|got|got|help from a friend
 make|hacer o crear|/meɪk/|made|made|a plan
 take|tomar|/teɪk/|took|taken|a short break
 see|ver|/siː/|saw|seen|the difference
 know|saber|/nəʊ/|knew|known|the answer
 think|pensar|/θɪŋk/|thought|thought|about the problem
 say|decir|/seɪ/|said|said|something useful
 tell|contar o decir a alguien|/tel/|told|told|a friend the news
 give|dar|/ɡɪv/|gave|given|an example
 find|encontrar|/faɪnd/|found|found|a solution
 come|venir|/kʌm/|came|come|to the meeting
 leave|salir o dejar|/liːv/|left|left|a message
 write|escribir|/raɪt/|wrote|written|a short reply
 read|leer|/riːd/|read|read|the instructions
 speak|hablar|/spiːk/|spoke|spoken|with a colleague
 hear|oír|/hɪə/|heard|heard|the question
 buy|comprar|/baɪ/|bought|bought|a ticket
 bring|traer|/brɪŋ/|brought|brought|a notebook
 choose|elegir|/tʃuːz/|chose|chosen|a useful example
 understand|entender|/ˌʌndəˈstænd/|understood|understood|the explanation
 learn|aprender|/lɜːn/|learned|learned|a new phrase
 work|trabajar|/wɜːk/|worked|worked|with the team
 ask|preguntar|/ɑːsk/|asked|asked|for clarification
 explain|explicar|/ɪkˈspleɪn/|explained|explained|the main idea
 check|comprobar|/tʃek/|checked|checked|the details
 practise|practicar|/ˈpræktɪs/|practised|practised|a short conversation
 compare|comparar|/kəmˈpeə/|compared|compared|the two options
 decide|decidir|/dɪˈsaɪd/|decided|decided|what to do next
 help|ayudar|/help/|helped|helped|a neighbour
 need|necesitar|/niːd/|needed|needed|more information
 want|querer|/wɒnt/|wanted|wanted|a clearer explanation
 plan|planear|/plæn/|planned|planned|a short trip
 change|cambiar|/tʃeɪndʒ/|changed|changed|the arrangement
 improve|mejorar|/ɪmˈpruːv/|improved|improved|the design
 suggest|sugerir|/səˈdʒest/|suggested|suggested|an alternative
 consider|considerar|/kənˈsɪdə/|considered|considered|the evidence
argue|argumentar|/ˈɑːɡjuː/|argued|argued|for a fairer approach
infer|inferir|/ɪnˈfɜː/|inferred|inferred|the meaning from context
imply|dar a entender|/ɪmˈplaɪ/|implied|implied|that the plan needs work
qualify|matizar|/ˈkwɒlɪfaɪ/|qualified|qualified|the statement
substantiate|fundamentar con pruebas|/səbˈstænʃieɪt/|substantiated|substantiated|the claim with evidence
refute|refutar|/rɪˈfjuːt/|refuted|refuted|the claim
corroborate|corroborar|/kəˈrɒbəreɪt/|corroborated|corroborated|the account with records
synthesise|sintetizar|/ˈsɪnθəsaɪz/|synthesised|synthesised|the main findings
distinguish|distinguir|/dɪˈstɪŋɡwɪʃ/|distinguished|distinguished|between the two meanings
clarify|aclarar|/ˈklærɪfaɪ/|clarified|clarified|the requirement
negotiate|negociar|/nɪˈɡəʊʃieɪt/|negotiated|negotiated|a fair agreement
acknowledge|reconocer|/əkˈnɒlɪdʒ/|acknowledged|acknowledged|the limitation
interpret|interpretar|/ɪnˈtɜːprɪt/|interpreted|interpreted|the remark in context
convey|transmitir|/kənˈveɪ/|conveyed|conveyed|the main idea
presume|suponer|/prɪˈzjuːm/|presumed|presumed|that the result was final
challenge|cuestionar|/ˈtʃælɪndʒ/|challenged|challenged|the assumption
revise|revisar y modificar|/rɪˈvaɪz/|revised|revised|the recommendation
mediate|mediar|/ˈmiːdieɪt/|mediated|mediated|a disagreement
summarise|resumir|/ˈsʌməraɪz/|summarised|summarised|the discussion
contrast|contrastar|/kənˈtrɑːst/|contrasted|contrasted|the two proposals`;
export const verbs=source.split('\n').map(row=>{
 const [base,meaning,ipa,past,participle,rest]=row.trim().split('|');
 return{base,meaning,ipa,past,participle,future:`will ${base}`,regular:past.endsWith('ed'),examples:{present:base==='be'?'I am ready.':`I ${base} ${rest}.`,past:`I ${past} ${rest}.`,perfect:`I have ${participle} ${rest}.`,future:`I will ${base} ${rest}.`,negative:base==='be'?'I am not ready.':`I do not ${base} ${rest}.`,question:base==='be'?'Are you ready?':`Do you ${base} ${rest}?`},note:base==='read'?'Read se pronuncia /riːd/ en presente y /red/ en pasado y participio.':base==='be'?'En presente: I am, you/we/they are, he/she/it is. En pasado: I/he/she/it was; you/we/they were.':base==='get'?'Got es participio habitual británico; gotten también se usa en inglés estadounidense.':''};
});
const questions={
 A1:['What is your name?','What do you do every day?','Can you ask me a simple question?'],
 A2:['What happened the last time you had to change a plan?','What are you going to do next, and why?','Could you ask me for the detail you need?'],
 B1:['Can you describe a problem and explain how you dealt with it?','What would you do differently in a similar situation?','What would you like to know about my experience?'],
 B2:['Which option would you recommend, and what trade-off would you accept?','How would you respond to someone who disagreed?','What question would help you check your assumption?'],
 C1:['How would you qualify your claim if the evidence were limited?','How would your wording change for a friend and a formal audience?','Which assumption in your explanation should I challenge?'],
 C2:['What alternative interpretation might a careful listener infer?','How would you preserve the nuance while explaining this to a beginner?','What new evidence would make you revise your position?']
};
const conversationHelp={A1:['¿Cómo te llamas?','¿Qué haces cada día?','¿Puedes hacerme una pregunta sencilla?'],A2:['¿Qué pasó la última vez que tuviste que cambiar un plan?','¿Qué vas a hacer después y por qué?','¿Podrías pedirme el dato que necesitas?'],B1:['¿Puedes describir un problema y explicar cómo lo resolviste?','¿Qué harías de otra manera en una situación parecida?','¿Qué te gustaría saber sobre mi experiencia?'],B2:['¿Qué opción recomendarías y qué desventaja aceptarías?','¿Cómo responderías a alguien que no está de acuerdo?','¿Qué pregunta te ayudaría a comprobar tu supuesto?'],C1:['¿Cómo matizarías tu afirmación si la evidencia fuera limitada?','¿Cómo cambiarían tus palabras al hablar con una amistad o con un público formal?','¿Qué supuesto de tu explicación debería cuestionar?'],C2:['¿Qué otra interpretación podría deducir una persona que escucha con cuidado?','¿Cómo conservarías el matiz al explicarlo a un principiante?','¿Qué evidencia nueva haría que revisaras tu postura?']};
export function enrichSessions(lessons){return lessons.map((lesson,index)=>{
 const verbPool=lesson.level==='A1'?verbs.slice(0,25):lesson.level==='A2'?verbs.slice(0,40):lesson.level==='B1'?verbs.slice(15,45):verbs.slice(25);
 const previous=lessons[index-1],dialogue=conversationFor(lesson,questions[lesson.level],conversationHelp[lesson.level]);
 const extra=verbs[(index*4)%verbs.length];
 const words=[...(lesson.words||[])];if(words.length<5){const v=verbs.find(v=>!words.some(w=>w.word===v.base)&&v.base===extra.base)||verbs.find(v=>!words.some(w=>w.word===v.base));words.push({word:v.base,meaning:v.meaning,example:v.examples.present,translation:`Práctica del verbo: ${v.meaning}.`});}
 const textItem=lesson.production||{id:`${lesson.id}-write`,lessonId:lesson.id,unitId:lesson.unitId,type:'text',skill:'grammar',mode:'practice',prompt:lesson.grammar[1].prompt,accepted:[lesson.grammar[1].options[lesson.grammar[1].answer]],model:lesson.grammar[1].options[lesson.grammar[1].answer],why:lesson.grammar[1].why};
 const sentences=[lesson.reading?.text,lesson.audio?.text,lesson.example].filter(Boolean).join(' ').match(/[^.!?]+[.!?]?/g)||[];
 const contextWords=words.map(w=>{const sentence=sentences.find(s=>new RegExp('\\b'+w.word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i').test(s));return{...w,example:w.example||sentence?.trim()||`Can you use “${w.word}” in a sentence?`,translation:w.translation||(sentence?'Busca esta idea en el contexto de la lección.':`¿Puedes usar «${w.meaning}» en una frase?`)};});
 return{...lesson,words:contextWords,production:textItem,duration:25,session:{minutes:'20–30 minutos, con las pausas que necesites',review:previous?[{prompt:`Explica sin mirar una idea de «${previous.title}».`,model:previous.example},{prompt:`¿Qué significa «${previous.word}»? Úsalo en una frase.`,model:`${previous.word}: ${previous.meaning}. ${previous.example}`}]:[{prompt:'¿Qué saludo en inglés conoces ya?',model:'Hello! Hi! Good morning!'},{prompt:'¿Cómo dirías tu nombre?',model:'My name is Ana. I am Ana.'}],verbs:Array.from({length:5},(_,i)=>({...verbPool[(index*4+i)%verbPool.length],review:i===4&&index>0})),conversation:dialogue.questions,conversationHelp:dialogue.help,pronunciation:{focus:lesson.level==='A1'?'Escucha los grupos de palabras y repítelos con calma. No necesitas imitar un acento para comunicarte.':lesson.level==='A2'?'Compara la frase completa con sus contracciones. Escucha el final de los verbos sin añadir una vocal extra.':['B1','B2'].includes(lesson.level)?'Marca las palabras que aportan la información principal. Une las palabras sin borrar las diferencias de significado.':'Cambia el énfasis para contrastar una persona, una acción o un resultado. Una lectura sintética no reproduce todos los matices de una conversación real.',phrase:lesson.example},selfCheck:['¿Comuniqué la idea principal?','¿Usé la estructura sin copiarla?','¿Puedo cambiar un dato y decir otra frase?','¿Pude pedir una aclaración cuando la necesité?']}};
});}
