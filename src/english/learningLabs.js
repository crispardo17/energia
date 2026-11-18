export const initialLibrary=()=>({stock:{bookA:2,bookB:1},operations:{}});
export function libraryRequest(state,{authenticated,ownsResource,bookId,key,lost=false}){
 const unchanged=(status,message)=>({state,status,message});
 if(!authenticated)return unchanged(401,'Primero hay que comprobar la identidad. No cambió ningún préstamo.');
 if(!ownsResource)return unchanged(403,'Una sesión no permite actuar sobre la cuenta de otra persona. No cambió ningún préstamo.');
 if(!['bookA','bookB'].includes(bookId)||!/^[a-z0-9-]{1,64}$/i.test(key))return unchanged(400,'Revisa el libro y la clave: usa letras, números y guiones.');
 if(Object.hasOwn(state.operations,key)){
  const old=state.operations[key];
  if(old.bookId!==bookId)return unchanged(409,'La misma clave representa otra intención: se rechaza cambiar el libro.');
  return {state,status:201,message:'Reconocimos la misma operación. Devolvemos el recibo guardado sin descontar otro ejemplar.',replayed:true,receipt:old};
 }
 if(state.stock[bookId]<=0)return unchanged(409,'Ya no hay ejemplares. No se confirma un préstamo sin disponibilidad.');
 const receipt={bookId,id:Object.keys(state.operations).length+1,price:bookId==='bookA'?12:18};
 const next={stock:{...state.stock,[bookId]:state.stock[bookId]-1},operations:{...state.operations,[key]:receipt}};
 return {state:next,status:lost?0:201,receipt,message:lost?'El préstamo se guardó, pero se perdió la respuesta. El resultado es incierto para el cliente. Repite la misma clave.':'Préstamo confirmado. El servidor calculó el precio: '+receipt.price+'. No confía en un precio cambiado en la pantalla.'};
}
export const examplePredictions=[{score:0.95,label:true},{score:0.8,label:false},{score:0.7,label:true},{score:0.55,label:false},{score:0.4,label:true},{score:0.2,label:false}];
export function classifierMetrics(threshold){
 const result={tp:0,fp:0,tn:0,fn:0};
 for(const r of examplePredictions){const predicted=r.score>=threshold;result[predicted?(r.label?'tp':'fp'):(r.label?'fn':'tn')]++;}
 return {...result,precision:result.tp+result.fp?result.tp/(result.tp+result.fp):null,recall:result.tp/(result.tp+result.fn)};
}
