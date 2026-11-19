export function validateWorkshop(value){
 const fail=()=>{throw Object.assign(new Error('Actividad no válida.'),{status:400});};
 if(!value||!Number.isInteger(value.part)||value.part<0||value.part>7||!Array.isArray(value.conversation)||value.conversation.length!==3||value.conversation.some(s=>typeof s!=='string'||s.length>2500)||typeof value.writing!=='string'||value.writing.length>2500)fail();
 return{part:value.part,conversation:value.conversation,writing:value.writing};
}
