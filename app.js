/* ===== AUDIT CONFIG: exact questions, options, points, verdicts and estimates ===== */
const CONFIG = {
  questions: [
    { label: 'FREQUENCY', text: 'How often do you do this?', max: 30, options: [
      {text:'Daily',points:30, explanation:'Doing this daily makes it a strong opportunity to reduce repeated work.'},
      {text:'A few times a week',points:22, explanation:'Doing this a few times a week creates recurring work worth reducing.'},
      {text:'Weekly',points:14, explanation:'A weekly routine offers a regular opportunity to save time.'},
      {text:'Monthly',points:6, explanation:'A monthly routine offers fewer opportunities to recover time.'}]},
    { label: 'DURATION', text: 'How long does it take each time?', max: 30, options: [
      {text:'Under 15 min',points:7, explanation:'Each run takes little time, which limits the time-saving opportunity per run.'},
      {text:'15–60 min',points:15, explanation:'Each run takes 15–60 minutes, so the time adds up across repeated runs.'},
      {text:'1–3 hours',points:23, explanation:'Each run takes hours, creating a substantial time-saving opportunity.'},
      {text:'More than 3 hours',points:30, explanation:'Each run takes more than three hours, creating a large time-saving opportunity.'}]},
    { label: 'CONSISTENCY', text: 'Do you follow the same steps each time?', max: 20, options: [
      {text:'Always the same',points:20, explanation:'Identical steps make the routine easier to automate reliably.'},
      {text:'Mostly the same',points:12, explanation:'Mostly consistent steps make the repeatable parts good candidates for automation.'},
      {text:'Varies a lot',points:4, explanation:'Steps that vary a lot call for more human judgment and make full automation harder.'}]},
    { label: 'TOOL HANDOFFS', text: 'Does it move information between tools?', max: 12, options: [
      {text:'Yes, constantly',points:12, explanation:'Constant transfers between tools offer a clear opportunity to automate handoffs.'},
      {text:'Sometimes',points:7, explanation:'Occasional transfers between tools offer opportunities to automate individual handoffs.'},
      {text:'No',points:0, explanation:'There are no transfers between tools to automate.'}]},
    { label: 'URGENCY', text: "What happens if it's done a day late?", max: 8, options: [
      {text:'A real problem',points:8, explanation:'A day of delay causes a real problem, which raises the value of timely execution.'},
      {text:'Minor annoyance',points:4, explanation:'A day of delay is a minor annoyance, so timely execution has some value.'},
      {text:'Nothing',points:0, explanation:'A day of delay has no consequence, so urgency does not increase its automation priority.'}]}
  ],
  verdicts: [{min:80,max:100,text:'Automate this now'},{min:50,max:79,text:'Automate parts of it'},{min:0,max:49,text:'Keep it manual, for now.'}],
  estimates: {timesPerYear:[250,150,50,12],minutesPerRun:[7.5,37.5,120,240],footnote:"Estimate uses 250 working days and midpoint durations. 'A few times a week' ≈ 3× weekly."}
};
/* ===== END CONFIG ===== */
function calculate(answers) {
  if(answers.length !== CONFIG.questions.length || answers.some((a,i)=>!Number.isInteger(a)||!CONFIG.questions[i].options[a])) throw new Error('Select one answer for each question.');
  const score=CONFIG.questions.reduce((total,q,i)=>total+q.options[answers[i]].points,0);
  const times=CONFIG.estimates.timesPerYear[answers[0]],minutes=CONFIG.estimates.minutesPerRun[answers[1]];
  return {score,verdict:CONFIG.verdicts.find(v=>score>=v.min&&score<=v.max).text,times,minutes,hours:Math.round(times*minutes/60)};
}
function explanation(name,answers){return `For “${name}”: `+CONFIG.questions.map((q,i)=>q.options[answers[i]].explanation).join(' ');}
if(typeof module!=='undefined') module.exports={CONFIG,calculate,explanation};
if(typeof document!=='undefined') {
const $=id=>document.getElementById(id),escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY='first-things-first-audits-v1';
let records=[],name='',answers=Array(5).fill(null),step=0,current=null;
try{const saved=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(saved)) records=saved.filter(r=>{try{return typeof r.name==='string'&&calculate(r.answers)}catch{return false}});}catch{}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(records));}catch{$('storage-note').textContent='Browser storage is unavailable. This list will last for this session.';}}
function focusTitle(){const h=$('audit').querySelector('h2');h.tabIndex=-1;h.focus({preventScroll:true});}
function start(){current=null;name='';answers=Array(5).fill(null);step=0;$('audit').innerHTML=`<div class="step-head"><span class="eyebrow">NEW ROUTINE</span><span class="pill">About a minute</span></div><h2>Let’s start with the busywork.</h2><p class="subtext">Pick one routine you do in your business.</p><form id="name-form"><label class="name-label" for="routine-name">Routine name</label><input id="routine-name" type="text" maxlength="200" required placeholder="e.g. Copying leads from forms into the CRM" autocomplete="off"><button class="primary start-button" type="submit"><span>Audit this routine</span><span aria-hidden="true">→</span></button><p class="micro">5 questions · No sign-up · Just clarity</p></form>`;$('name-form').onsubmit=e=>{e.preventDefault();const input=$('routine-name');name=input.value.trim();if(!name){input.setCustomValidity('Enter a routine name.');input.reportValidity();return;}showQuestion();};$('routine-name').oninput=e=>e.target.setCustomValidity('');}
function showQuestion(){const q=CONFIG.questions[step];$('audit').innerHTML=`<div class="step-head"><span class="eyebrow">QUESTION ${step+1} OF 5</span><span class="pill">${q.label}</span></div><div class="progress" aria-hidden="true">${CONFIG.questions.map((_,i)=>`<span class="${i<=step?'done':''}"></span>`).join('')}</div><p class="routine-tag">${escape(name)}</p><h2 id="question">${q.text}</h2><div class="options" role="radiogroup" aria-labelledby="question">${q.options.map((o,i)=>`<label class="option"><input type="radio" name="answer" value="${i}" ${answers[step]===i?'checked':''}><span>${o.text}</span></label>`).join('')}</div><div class="actions"><button class="text-button" id="back">Back</button><button class="primary" id="next" ${answers[step]===null?'disabled':''}>${step===4?'See my result':'Continue'} <span aria-hidden="true">→</span></button></div>`;document.querySelectorAll('input[name=answer]').forEach(el=>el.onchange=()=>{answers[step]=Number(el.value);$('next').disabled=false;});$('back').onclick=()=>{if(step>0){step--;showQuestion();}else{const old=name;start();$('routine-name').value=old;$('routine-name').focus();}};$('next').onclick=()=>{if(answers[step]===null)return;if(step<4){step++;showQuestion();}else{current={name,answers:[...answers]};records.push(current);persist();showResult();renderList();}};focusTitle();}
function resultText(r){const v=calculate(r.answers);return [`Routine: ${r.name}`,`${v.score}/100 · ${v.verdict}`,...CONFIG.questions.map((q,i)=>`${q.label} · ${q.options[r.answers[i]].text} · ${q.options[r.answers[i]].points} / ${q.max}`),explanation(r.name,r.answers),`${v.hours} hrs per year (${v.times}× per year × ${v.minutes} min ÷ 60, rounded)`,CONFIG.estimates.footnote].join('\n');}
function showResult(){const r=current,v=calculate(r.answers);$('audit').innerHTML=`<div class="step-head"><span class="eyebrow">YOUR AUTOMATION AUDIT</span><span class="pill">Complete ✓</span></div><div class="score-area"><div class="score-ring" style="--score:${v.score}"><div class="score-inner"><strong>${v.score}</strong><span>out of 100</span></div></div><div><h2>${v.verdict}</h2><p class="result-name">${escape(r.name)}</p></div></div><table class="breakdown" aria-label="Score breakdown"><tbody>${CONFIG.questions.map((q,i)=>`<tr><th scope="row">${q.label}</th><td>${q.options[r.answers[i]].text}</td><td>${q.options[r.answers[i]].points} / ${q.max}</td></tr>`).join('')}</tbody></table><p class="explanation">${escape(explanation(r.name,r.answers))}</p><div class="hours"><strong>${v.hours.toLocaleString()} hrs <span>per year on this routine</span></strong><p>${v.times}× per year × ${v.minutes} min ÷ 60, rounded</p></div><p class="footnote">${CONFIG.estimates.footnote}</p><div class="actions"><button class="primary" id="another">Audit another routine</button><button class="secondary" id="copy">Copy result</button></div><div class="copy-status" id="copy-status" role="status"></div>`;$('another').onclick=()=>{start();$('routine-name').focus();};$('copy').onclick=async()=>{const text=resultText(r);try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);}else{const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.append(area);area.select();const success=document.execCommand('copy');area.remove();if(!success)throw Error();}$('copy-status').textContent='Result copied.';}catch{$('copy-status').textContent='Copy is unavailable. Select and copy the text below.';const area=document.createElement('textarea');area.value=text;area.style.width='100%';area.rows=8;area.setAttribute('aria-label','Result to copy');$('copy-status').append(area);area.focus();area.select();}};focusTitle();}
function renderList(){$('count').textContent=records.length;$('clear').hidden=!records.length;const sorted=records.map(r=>({...r,...calculate(r.answers)})).sort((a,b)=>b.score-a.score);$('list').innerHTML=sorted.length?sorted.map((r,i)=>`<div class="priority-row"><span class="rank">${String(i+1).padStart(2,'0')}</span><div><div class="priority-name">${escape(r.name)}</div><div class="priority-verdict">${r.verdict}</div></div><span class="priority-hours">${r.hours.toLocaleString()} hrs / year</span><div class="priority-score">${r.score}<span> /100</span></div></div>`).join(''):`<div class="empty"><span class="empty-icon" aria-hidden="true">≡</span><div><strong>Your next best move starts here.</strong><p>Audit a routine and it will appear here, ranked by score.</p></div></div>`;}
$('clear').onclick=()=>{if(confirm('Clear all routines from your priority list?')){records=[];persist();renderList();}};
start();renderList();
}
