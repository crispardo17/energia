export const guideSteps=['Comprender','Ver un ejemplo','Practicar','Recordar'];
export function advanceGuide(step,concept,total){
 if(step<3)return {step:step+1,concept,finished:false};
 if(concept+1<total)return {step:0,concept:concept+1,finished:false};
 return {step,concept,finished:true};
}
export function retreatGuide(step,concept){return step>0?{step:step-1,concept}:concept>0?{step:3,concept:concept-1}:{step:0,concept:0};}
