// lib/scoring.ts
export type AnswerValue = 'yes'|'no'|'unknown';

export function scoreChecklist(answers:{key:string;value:AnswerValue}[]){
  const total = Math.max(answers.length, 1);
  let pts = 0;
  const noKeys:string[] = [];
  for(const a of answers){
    if (a.value==='yes') pts+=2;
    if (a.value==='no')  noKeys.push(a.key);
  }
  const score = Math.round((pts/(total*2))*100);
  const grade = score>=90?'A+':score>=80?'A':score>=70?'B':score>=60?'C':'D';
  const summary = score>=70 ? 'Solid baseline with room for improvement.' : 'Foundational controls need attention.';
  return { score, grade, summary, noKeys };
}
