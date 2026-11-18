export const defaultPreferences={largeText:false,simple:true,minutes:10,audioRate:0.85};
export function validatePreferences(value){
 if(!value||typeof value.largeText!=='boolean'||typeof value.simple!=='boolean'||![5,10,20].includes(value.minutes)||![0.7,0.85,1].includes(value.audioRate))throw Object.assign(new Error('Elige opciones de aprendizaje válidas.'),{status:400});
 return Object.fromEntries(Object.keys(defaultPreferences).map(k=>[k,value[k]]));
}
export function reviewDelay(streak,correct){return correct?[1,3,7,14,30][Math.min(Math.max(streak,0),4)]:0;}
export async function rememberFeedback(db,user,course,lessonId,feedback){
 const grouped=new Map();
 for(const f of feedback){const id=f.lessonId||lessonId,key=id+'|'+(f.concept||f.skill);const old=grouped.get(key);grouped.set(key,{id,concept:f.concept||f.skill,correct:(old?.correct??true)&&f.correct});}
 for(const f of grouped.values())await db.query(`INSERT INTO academy.learning_reviews(user_id,course_id,lesson_id,concept,streak,last_correct,due_at)
 VALUES($1,$2,$3,$4,CASE WHEN $5 THEN 1 ELSE 0 END,$5,now()+CASE WHEN $5 THEN interval '1 day' ELSE interval '0 day' END)
 ON CONFLICT(user_id,course_id,lesson_id,concept) DO UPDATE SET
 streak=CASE WHEN $5 THEN CASE WHEN academy.learning_reviews.due_at<=now() THEN academy.learning_reviews.streak+1 ELSE academy.learning_reviews.streak END ELSE 0 END,
 last_correct=$5,updated_at=now(),due_at=CASE WHEN NOT $5 THEN now() WHEN academy.learning_reviews.due_at>now() THEN academy.learning_reviews.due_at ELSE now()+make_interval(days=>CASE WHEN academy.learning_reviews.streak=0 THEN 1 WHEN academy.learning_reviews.streak=1 THEN 3 WHEN academy.learning_reviews.streak=2 THEN 7 WHEN academy.learning_reviews.streak=3 THEN 14 ELSE 30 END) END`,[user,course,f.id,f.concept,f.correct]);
}
