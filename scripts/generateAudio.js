import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { listening } from '../server/listening.js';
import { a1Lessons } from '../server/a1-curriculum.js';
import { a1Forms } from '../server/a1-assessments.js';
import {advancedLessons} from '../server/english-advanced.js';
import {evaluationScripts} from '../server/english-evaluations.js';
import { forms } from '../server/exam-content.js';
const directory=join(process.cwd(),'public/audio');mkdirSync(directory,{recursive:true});
const temp=mkdtempSync(join(tmpdir(),'angkor-audio-'));
try {
 const scripts=Object.entries(listening).filter(([id])=>!id.startsWith('a1-')).map(([id,value])=>[id,value[0]]);
 for(const l of [...a1Lessons,...advancedLessons]) scripts.push([l.id,l.audio.text]);
 a1Forms.forEach((versions,index)=>versions.forEach((form,v)=>scripts.push([`a1-unit${index+1}-${v?'review':'exam'}`,form[1][0]])));
 for(const [level,versions] of Object.entries(forms).filter(([id])=>id!=='A1')) versions.forEach((form,i)=>scripts.push([`${level.toLowerCase()}-${i?'review':'exam'}`,form[0]]));
 scripts.push(...evaluationScripts);
 for(const [id,text] of scripts) {
  if(existsSync(join(directory,`${id}.wav`))) continue;
  const aiff=join(temp,`${id}.aiff`);
  execFileSync('/usr/bin/say',['-v','Samantha','-r',id.startsWith('a1')?'135':'155','-o',aiff,text]);
  execFileSync('/usr/bin/afconvert',['-f','WAVE','-d','LEI16@22050',aiff,join(directory,`${id}.wav`)]);
 }
 console.log(`Generated ${scripts.length} English recordings.`);
} finally {rmSync(temp,{recursive:true,force:true});}
