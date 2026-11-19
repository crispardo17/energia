export const BOOK_ID='algorithm-book';
const fail=(status,message)=>{throw Object.assign(new Error(message),{status});};
export function chapterNumber(value=1){if(typeof value!=='number'&&(typeof value!=='string'||!/^\d+$/.test(value)))fail(400,'Capítulo no válido.');const n=Number(value);if(!Number.isInteger(n)||n<1||n>50)fail(400,'Capítulo no válido.');return n;}
export async function readBook(db,value){
 const number=chapterNumber(value);
 const book=(await db.query('SELECT id,title,description,outline FROM academy.courses WHERE id=$1',[BOOK_ID])).rows[0];
 const chapter=(await db.query('SELECT number,title,body,version FROM academy.reading_chapters WHERE course_id=$1 AND number=$2 AND published=true',[BOOK_ID,number])).rows[0];
 if(!book||!chapter)fail(404,'Este capítulo todavía no está publicado.');
 return {book,chapter};
}
export function validateReadingPoint(value,chapter){
 const number=chapterNumber(value?.chapter);
 if(number!==chapter.number||!chapter.body.sections.some(s=>s.id===value.section)||![18,21,24].includes(value.fontSize))fail(400,'Punto de lectura no válido.');
 return{chapter:number,section:value.section,fontSize:value.fontSize};
}
export async function readingProgress(db,user){return (await db.query('SELECT p.chapter_number AS chapter,p.section_id AS section,p.font_size AS "fontSize",p.updated_at FROM academy.reading_progress p JOIN academy.reading_chapters c ON c.course_id=p.course_id AND c.number=p.chapter_number WHERE p.user_id=$1 AND p.course_id=$2 AND c.published=true',[user,BOOK_ID])).rows[0]||null;}
export async function saveReadingProgress(db,user,value){
 const {chapter}=await readBook(db,value?.chapter),point=validateReadingPoint(value,chapter);
 await db.query(`INSERT INTO academy.reading_progress(user_id,course_id,chapter_number,section_id,font_size) VALUES($1,$2,$3,$4,$5) ON CONFLICT(user_id,course_id) DO UPDATE SET chapter_number=EXCLUDED.chapter_number,section_id=EXCLUDED.section_id,font_size=EXCLUDED.font_size,updated_at=now()`,[user,BOOK_ID,point.chapter,point.section,point.fontSize]);
 return{saved:true,point};
}
