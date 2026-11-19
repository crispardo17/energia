import fs from 'node:fs';
import {lessons,levels,units} from '../server/content.js';
import {verbs} from '../server/english-session.js';
import {publicLesson} from '../server/assessment.js';
// Share verb records instead of shipping the same forms 1,200 times to phones.
const content=lessons.map(l=>{const p=publicLesson(l);return{...p,session:{...p.session,verbs:p.session.verbs.map(v=>({index:verbs.findIndex(x=>x.base===v.base),review:v.review}))}};});
fs.writeFileSync('src/english/course.js',`// Public learning content only. Answers remain on the server.\nexport const levels=${JSON.stringify(levels,null,2)};\nexport const units=${JSON.stringify(units,null,2)};\nconst verbs=${JSON.stringify(verbs)};\nconst content=${JSON.stringify(content,null,2)};\nexport const lessons=content.map(l=>({...l,session:{...l.session,verbs:l.session.verbs.map(v=>({...verbs[v.index],review:v.review}))}}));\n`);
console.log(`${lessons.length} public lessons synchronized (${units.length} units).`);
