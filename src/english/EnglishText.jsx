import {Fragment} from 'react';
const terms=['I am twenty','I have twenty','How old are you','I am Sara','am Sara','I work','she works','Can you repeat that, please','I am','I’m','I’m from','I live in','Where are you from','How do you spell','Is that right','Nice to meet you','good morning','good evening','good afternoon','hello','hi','goodbye','fifteen','fifty','-teen','be','my','your','his','her','can','could','should','would','will','have','had','did','does','do','don’t','doesn’t','didn’t','going to','have been','has been','used to','for','since','who','which','whose','where','what','when','why','how','because','although','despite','unless','whereas','yet','already','still','the','to','enough','too','rarely','not necessarily','would have','had been','have done'];
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export default function EnglishText({text='',lesson}){
 const phrases=[...terms,...(lesson?.words||[]).map(w=>w.word)];
 const words=(lesson?.example||'').replace(/[.!?,;:]/g,'').split(/\s+/);
 for(let i=0;i<words.length;i++)for(let n=2;n<=8&&i+n<=words.length;n++)phrases.push(words.slice(i,i+n).join(' '));
 const pattern=new RegExp(`(?<![\\p{L}])(${[...new Set(phrases.filter(Boolean))].sort((a,b)=>b.length-a.length).map(escape).join('|')})(?![\\p{L}])`,'giu');
 const parts=String(text).split(pattern);
 return <>{parts.map((part,i)=>i%2?<strong key={i} lang="en" className="english-phrase">{part}</strong>:<Fragment key={i}>{part}</Fragment>)}</>;
}
