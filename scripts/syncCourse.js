import fs from 'node:fs';
import { lessons,levels,units } from '../server/content.js';
import { publicLesson } from '../server/assessment.js';
fs.writeFileSync('src/english/course.js',`// Public learning content only. Answers remain on the server.\nexport const levels=${JSON.stringify(levels,null,2)};\nexport const units=${JSON.stringify(units,null,2)};\nexport const lessons=${JSON.stringify(lessons.map(publicLesson),null,2)};\n`);
console.log(`${lessons.length} public lessons synchronized (${units.length} A1 units).`);
