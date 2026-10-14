(()=>{
const I18N={
 de:{
  htmlLang:'de',docTitle:'RED Interview · Wissensquiz',
  title:'Wissensquiz',sub:'Quellenbasiert. Wiederholbar. Offline.',
  countLabel:'Fragen in der Sammlung',topicLabel:'Thema',allTopics:'Alle Themen',
  startBtn:'Quiz starten',note:'Falsche Antworten kommen am Rundenende erneut. Erstversuch zählt fürs Ergebnis.',
  nextBtn:'Weiter',doneTitle:'Runde abgeschlossen.',againBtn:'Noch einmal',retryBtn:'Erneut laden ↻',
  loadError:'Die Wissensdatenbank konnte nicht geladen werden. Prüfe die Verbindung und lade die Seite erneut.',
  score:n=>`Erstversuch: ${n}`,progress:(a,b)=>`${a} / ${b}`,
  correct:'Richtig.',again:'Noch einmal merken.',sourceLabel:'Quelle',
  result:(n,t)=>`Du hast ${n} von ${t} Fragen im Erstversuch richtig beantwortet.`,
  imgAlt:'Originalquelle: Spektraldarstellung; zur vergrößerten Ansicht anklicken',
  imgZoomAlt:'Vergrößerte Bildquelle'
 },
 en:{
  htmlLang:'en',docTitle:'RED Interview · Knowledge Quiz',
  title:'Knowledge Quiz',sub:'Source-based. Repeatable. Offline.',
  countLabel:'questions in the collection',topicLabel:'Topic',allTopics:'All topics',
  startBtn:'Start quiz',note:'Wrong answers return at the end of the round. The first attempt counts toward your result.',
  nextBtn:'Next',doneTitle:'Round complete.',againBtn:'Again',retryBtn:'Reload ↻',
  loadError:'The knowledge base could not be loaded. Check your connection and reload the page.',
  score:n=>`First try: ${n}`,progress:(a,b)=>`${a} / ${b}`,
  correct:'Correct.',again:'Note it for next time.',sourceLabel:'Source',
  result:(n,t)=>`You answered ${n} of ${t} questions correctly on the first try.`,
  imgAlt:'Original source: spectral view; click to enlarge',
  imgZoomAlt:'Enlarged image source'
 }
};
let lang=localStorage.getItem('lang')||'en';if(!I18N[lang])lang='en';
let db,deck=[],i=0,first=0,answered=false,started=false;
const $=s=>document.querySelector(s),t=()=>I18N[lang];
const shuffle=a=>{a=[...a];for(let j=a.length-1;j>0;j--){let k=Math.floor(Math.random()*(j+1));[a[j],a[k]]=[a[k],a[j]]}return a};
function applyStatic(){const L=t();document.documentElement.lang=L.htmlLang;document.title=L.docTitle;
 document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(L[k]!=null)el.textContent=L[k]});
 document.querySelectorAll('.lang').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));}
async function init(){try{
  $('#error').classList.add('hidden');$('#retry').classList.add('hidden');
  let c=new AbortController(),to=setTimeout(()=>c.abort(),8000);
  let url=new URL(`knowledge.${lang}.json`,document.baseURI).href;
  let r=await fetch(url,{signal:c.signal,cache:'no-store'});clearTimeout(to);
  if(!r.ok)throw Error('HTTP '+r.status);db=await r.json();
  $('#count').textContent=db.questions.length;
  const sel=$('#topic');sel.innerHTML='';sel.insertAdjacentHTML('beforeend',`<option value="all">${t().allTopics}</option>`);
  [...new Set(db.questions.map(q=>q.topic))].forEach(x=>sel.insertAdjacentHTML('beforeend',`<option>${x}</option>`));
 }catch(e){$('#error').textContent=t().loadError;$('#error').classList.remove('hidden');$('#retry').classList.remove('hidden')}}
function start(){let topic=$('#topic').value;deck=shuffle(db.questions.filter(q=>topic==='all'||q.topic===topic));i=first=0;started=true;$('#setup').classList.add('hidden');$('#done').classList.add('hidden');$('#quiz').classList.remove('hidden');render()}
function render(){answered=false;let q=deck[i],L=t();$('#progress').textContent=L.progress(i+1,deck.length);$('#score').textContent=L.score(first);$('#bar').style.width=((i)/deck.length*100)+'%';let img=q.image?`<img class="visual" src="${q.image}" alt="${L.imgAlt}" data-zoom>`:'';$('#card').innerHTML=`<div class="tag">${q.topic}</div>${img}<h2 class="question">${q.question}</h2><div class="answers">${shuffle(q.answers).map((a,n)=>`<button class="answer" data-id="${a.id}"><b>${String.fromCharCode(65+n)}</b>${a.text}</button>`).join('')}</div>`;$('#feedback').innerHTML='';$('#next').classList.add('hidden');document.querySelectorAll('.answer').forEach(b=>b.onclick=()=>choose(b,q));document.querySelector('[data-zoom]')?.addEventListener('click',e=>{let m=document.createElement('div');m.className='modal';m.innerHTML=`<img src="${e.target.src}" alt="${L.imgZoomAlt}">`;m.onclick=()=>m.remove();document.body.append(m)})}
function choose(btn,q){if(answered)return;answered=true;let L=t(),ok=btn.dataset.id===q.correctAnswerId;if(ok)first++;document.querySelectorAll('.answer').forEach(b=>{b.disabled=true;if(b.dataset.id===q.correctAnswerId)b.classList.add('correct')});if(!ok){btn.classList.add('wrong');deck.push(q)}$('#score').textContent=L.score(first);$('#feedback').innerHTML=`<div class="explain"><strong>${ok?L.correct:L.again}</strong> ${q.explanation}<br><small>${L.sourceLabel}: ${q.source}</small></div>`;$('#next').classList.remove('hidden')}
function next(){i++;if(i>=deck.length){$('#quiz').classList.add('hidden');$('#done').classList.remove('hidden');$('#result').textContent=t().result(first,deck.length)}else render()}
async function setLang(l){if(l===lang||!I18N[l])return;lang=l;localStorage.setItem('lang',l);applyStatic();await init();if(started){$('#quiz').classList.add('hidden');$('#done').classList.add('hidden');$('#setup').classList.remove('hidden');started=false}}
$('#start').onclick=start;$('#next').onclick=next;$('#retry').onclick=init;$('#again').onclick=()=>{$('#done').classList.add('hidden');start()};
document.querySelectorAll('.lang').forEach(b=>b.onclick=()=>setLang(b.dataset.lang));
applyStatic();init();
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{})
})();
