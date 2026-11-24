const VERSAO="smartpav-v2";
const ARQUIVOS=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-maskable-512.png"];

self.addEventListener("install",e=>{
  e.waitUntil(caches.open(VERSAO).then(c=>c.addAll(ARQUIVOS)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("smartpav-")&&k!==VERSAO).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET"||new URL(r.url).origin!==self.location.origin)return;
  e.respondWith(
    fetch(r,{cache:"no-cache"}).then(resp=>{
      if(resp&&resp.ok){const copia=resp.clone();caches.open(VERSAO).then(c=>c.put(r,copia))}
      return resp;
    }).catch(()=>caches.match(r).then(x=>x||(r.mode==="navigate"?caches.match("./index.html"):undefined)))
  );
});
