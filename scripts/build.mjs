import fs from 'node:fs'; import path from 'node:path';
const root=process.cwd(), dist=path.join(root,'dist'); fs.rmSync(dist,{recursive:true,force:true}); fs.mkdirSync(path.join(dist,'assets'),{recursive:true});
const LANGS=['de','en'];
const ids=LANGS.map(l=>{
  const db=JSON.parse(fs.readFileSync(path.join(root,'data',`knowledge.${l}.json`),'utf8')); const seen=new Set();
  if(!db.id||!db.title||!Array.isArray(db.questions)) throw Error(`Ungültiges Wurzel-Schema (${l})`);
  for(const q of db.questions){if(seen.has(q.id))throw Error('Doppelte ID '+q.id+` (${l})`);seen.add(q.id);if(!q.question||!Array.isArray(q.answers)||q.answers.length!==4||!q.answers.some(a=>a.id===q.correctAnswerId))throw Error('Frage ungültig '+q.id+` (${l})`);for(const a of q.answers)if(!a.id||!a.text)throw Error('Antwort ungültig '+q.id+` (${l})`);if(q.image&&!fs.existsSync(path.join(root,q.image)))throw Error('Bild fehlt '+q.image)}
  return {lang:l,count:db.questions.length,questionIds:db.questions.map(q=>q.id).join(',')};
});
const [a,b]=ids; if(a.questionIds!==b.questionIds) throw Error('Fragen-IDs/Reihenfolge weichen zwischen Sprachen ab');
fs.cpSync(path.join(root,'assets'),path.join(dist,'assets'),{recursive:true}); for(const l of LANGS)fs.copyFileSync(path.join(root,'data',`knowledge.${l}.json`),path.join(dist,`knowledge.${l}.json`)); for(const f of ['index.html','app.js','styles.css'])fs.copyFileSync(path.join(root,'src',f),path.join(dist,f));
const count=ids[0].count;
fs.writeFileSync(path.join(dist,'manifest.webmanifest'),JSON.stringify({name:'RED Interview · Knowledge Quiz',short_name:'RED Quiz',start_url:'./',display:'standalone',background_color:'#10151c',theme_color:'#e85d3f',icons:[{src:'./assets/icon-192.png',sizes:'192x192',type:'image/png'},{src:'./assets/icon-512.png',sizes:'512x512',type:'image/png'}]},null,2));
const precache=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest',...LANGS.map(l=>`./knowledge.${l}.json`),...fs.readdirSync(path.join(root,'assets')).filter(f=>f.endsWith('.png')).map(f=>'./assets/'+f)];
fs.writeFileSync(path.join(dist,'sw.js'),`const V='red-quiz-v2';self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(${JSON.stringify(precache)})).then(()=>self.skipWaiting()).catch(()=>{}))});self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(x=>x||fetch(e.request).then(r=>{if(r.ok){const z=r.clone();caches.open(V).then(c=>c.put(e.request,z))}return r}).catch(()=>caches.match('./index.html')))));`);
console.log(`Build OK: ${count} Fragen pro Sprache (${LANGS.join(', ')}), ${fs.readdirSync(path.join(root,'assets')).length} Bilder`);
