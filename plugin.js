// KBLLB Media Index — Kino TV plugin.
// Lists the user's source directory, searches Internet Archive, and resolves only direct,
// publicly exposed media URLs. It does not bypass DRM, logins, paywalls, or protected player APIs.
const ARCHIVE = "https://archive.org";
const SOURCES = [
 {id:"fly-stream",title:"Fly Stream",category:"Películas y series",url:"https://share.google/gmMvOn5uR4aExEUBK"},
 {id:"bingebang",title:"BingeBang",category:"Películas y series",url:"https://zoechip.bz/home"},
 {id:"cinebros",title:"Cinebros",category:"Películas y series",url:"https://cinebros.net/"},
 {id:"zenox",title:"Zenox",category:"Películas y series",url:"https://zenox.lol/"},
 {id:"redflix",title:"Redflix",category:"Películas y series",url:"https://redflix.one/"},
 {id:"nexa",title:"Nexa",category:"Películas y series",url:"https://nexa.mov/"},
 {id:"flixer",title:"Flixer",category:"Películas y series",url:"https://flixer.gd/"},
 {id:"boredflix",title:"Boredflix",category:"Películas y series",url:"https://boredflix.to/"},
 {id:"anichi",title:"Anichi",category:"Anime y animación",url:"https://anichi.to/home"},
 {id:"animesalt",title:"AnimeSalt",category:"Anime y animación",url:"https://animesalt.to/"},
 {id:"anihq",title:"AniHQ",category:"Anime y animación",url:"https://anihq.org/home"},
 {id:"mirrors",title:"Mirrors",category:"Anime y animación",url:"https://mirrors.st/"},
 {id:"wcostream",title:"WatchCartoonOnline",category:"Anime y animación",url:"https://www.wcostream.org/"},
 {id:"kisscartoon",title:"KissCartoon",category:"Anime y animación",url:"https://kisscartoon.nz/"},
 {id:"kimcartoon",title:"KimCartoon",category:"Anime y animación",url:"https://kimcartoon.li/"},
 {id:"gostreameast",title:"GoStreamEast",category:"Deportes y TV en directo",url:"https://gostreameast.link/"},
 {id:"strmd",title:"Strmd",category:"Deportes y TV en directo",url:"https://strmd.link/"},
 {id:"thetvapp",title:"TheTVApp",category:"Deportes y TV en directo",url:"https://thetvapp.st/"},
 {id:"aurasports",title:"AuraSports",category:"Deportes y TV en directo",url:"https://aurasports.xyz/"},
 {id:"damitv",title:"DamiTV",category:"Deportes y TV en directo",url:"https://damitv.st/"},
 {id:"footballia",title:"Footballia",category:"Deportes y TV en directo",url:"https://footballia.net/"},
 {id:"mlblive",title:"MLB Live",category:"Deportes y TV en directo",url:"https://mlblive.net/"},
 {id:"timesoccertv",title:"Time Soccer TV",category:"Deportes y TV en directo",url:"https://timesoccertv.com/"},
 {id:"documentarymania",title:"Documentary Mania",category:"Documentales y archivos",url:"https://www.documentarymania.com/"},
 {id:"documentarytube",title:"Documentary Tube",category:"Documentales y archivos",url:"https://www.documentarytube.com/"},
 {id:"archive-org",title:"Internet Archive",category:"Documentales y archivos",url:"https://archive.org/"},
 {id:"fmhy-video",title:"FMHY · Video Tools",category:"Herramientas y referencias",url:"https://fmhy.net/video-tools/#video-download"},
 {id:"fmhy-downloading",title:"FMHY · Downloading",category:"Herramientas y referencias",url:"https://fmhy.net/downloading"},
 {id:"leonflix",title:"Leonflix",category:"Herramientas y referencias",url:"https://leonflix.net/"},
 {id:"wget",title:"GNU Wget",category:"Herramientas y referencias",url:"https://www.gnu.org/software/wget/"},
 {id:"orionoid",title:"Orionoid",category:"Herramientas y referencias",url:"https://orionoid.com/"},
 {id:"sanet",title:"Sanet",category:"Herramientas y referencias",url:"https://sanet.st/full/"},
 {id:"hatt-github",title:"Hatt · GitHub",category:"Herramientas y referencias",url:"https://github.com/FrenchGithubUser/Hatt"}
];
const CATEGORIES=[
 {id:"movies",title:"Películas y series",match:"Películas y series"},
 {id:"anime",title:"Anime y animación",match:"Anime y animación"},
 {id:"sports",title:"Deportes y TV en directo",match:"Deportes y TV en directo"},
 {id:"docs",title:"Documentales y archivos",match:"Documentales y archivos"},
 {id:"tools",title:"Herramientas y referencias",match:"Herramientas y referencias"}
];
function item(s){return {id:"source-"+s.id,ref:"source:"+s.id,title:s.title,kind:"movie",overview:s.category+" · Fuente externa: "+s.url};}
function log(...a){try{kino.log(...a);}catch(_){}}
async function getJson(url){const r=await kino.fetch(url);if(!r.ok)throw new Error("HTTP "+r.status);return r.json();}
async function archiveSearch(q,type="movie"){
 const base=type==="series" ? 'collection:(classic_tv) AND mediatype:(movies)' : 'mediatype:(movies)';
 const url=ARCHIVE+"/advancedsearch.php?q="+encodeURIComponent("title:("+q+") AND "+base)+"&fl[]=identifier&fl[]=title&fl[]=year&fl[]=description&rows=20&page=1&output=json";
 const d=await getJson(url);return d&&d.response&&Array.isArray(d.response.docs)?d.response.docs:[];
}
function archiveItem(d,kind="movie"){return {id:"archive-"+d.identifier,ref:"archive:"+d.identifier,title:String(Array.isArray(d.title)?d.title[0]:(d.title||d.identifier)),kind,year:d.year?String(Array.isArray(d.year)?d.year[0]:d.year):undefined,poster:ARCHIVE+"/services/img/"+encodeURIComponent(d.identifier),overview:String(Array.isArray(d.description)?d.description.join(" "):(d.description||"Vídeo en Internet Archive.")).replace(/<[^>]*>/g,"").slice(0,350)};}
function sourceById(id){return SOURCES.find(s=>s.id===id);}
function directMediaCandidates(html,pageUrl){
 const candidates=[];
 const patterns=[
  /<video\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/ig,
  /<source\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/ig,
  /<meta\b[^>]*(?:property|name)\s*=\s*["'](?:og:video|og:video:url|twitter:player:stream)["'][^>]*content\s*=\s*["']([^"']+)["']/ig,
  /<meta\b[^>]*content\s*=\s*["']([^"']+)["'][^>]*(?:property|name)\s*=\s*["'](?:og:video|og:video:url|twitter:player:stream)["']/ig
 ];
 for(const re of patterns){let m;while((m=re.exec(html))!==null){try{const u=new URL(m[1].replace(/&amp;/g,"&"),pageUrl);if(u.protocol==="https:"&&/\.(mp4|m4v|webm|m3u8)(?:$|[?#])/i.test(u.href)&&!candidates.includes(u.href))candidates.push(u.href);}catch(_){}}}
 return candidates.sort((a,b)=>mediaScore(b)-mediaScore(a));
}
function mediaScore(url,quality="auto"){
 const hls=/\.m3u8(?:$|[?#])/i.test(url);
 const m=url.match(/(?:^|[^0-9])(2160|1440|1080|720|540|480|360|240)p?(?:[^0-9]|$)/i);
 const resolution=m?Number(m[1]):0;
 // Auto/mobile: prefer adaptive HLS. Max: prefer a clearly-labelled high resolution.
 if(quality==="max")return resolution*10+(hls?5:0);
 if(quality==="low")return (hls?10000:0)+(resolution?Math.max(0,1000-resolution):500);
 return (hls?10000:0)+resolution;
}
function mediaLabel(url){
 const m=url.match(/(?:^|[^0-9])(2160|1440|1080|720|540|480|360|240)p?(?:[^0-9]|$)/i);
 return /\.m3u8(?:$|[?#])/i.test(url)?"HLS · adaptativo":m?m[1]+"p":/\.mp4(?:$|[?#])/i.test(url)?"MP4 · resolución no indicada":"Video";
}
export async function categories(){return CATEGORIES.map(c=>({id:"kbllb-"+c.id,title:c.title,ref:c.id}));}
export async function home(){
 const rows=CATEGORIES.map(c=>({id:c.id,ref:c.id,title:c.title,items:SOURCES.filter(s=>s.category===c.match).map(item)}));
 try{rows.push({id:"archive-docs",ref:"archive-docs",title:"Vídeos reproducibles de Internet Archive",items:(await archiveSearch("documentary")).map(archiveItem)});}catch(e){log("Archive home",e.message);}
 return rows;
}
export async function browse(ref,cursor){
 const c=CATEGORIES.find(x=>x.id===ref);
 if(c)return {items:SOURCES.filter(s=>s.category===c.match).map(item)};
 if(ref==="archive-docs"){const page=Math.max(1,Number(cursor)||1);const u=ARCHIVE+"/advancedsearch.php?q="+encodeURIComponent("mediatype:(movies) AND (subject:documentary OR title:documentary)")+"&fl[]=identifier&fl[]=title&fl[]=year&fl[]=description&rows=30&page="+page+"&output=json";const d=await getJson(u);const docs=d&&d.response&&Array.isArray(d.response.docs)?d.response.docs:[];return {items:docs.map(archiveItem),next:docs.length===30?String(page+1):undefined};}
 throw kino.error("not_found","Categoría desconocida.");
}
export async function search(query){
 const q=String((query&&(query.q||query.query||query.title))||"").trim();
 if(!q)return SOURCES.map(item);
 const matches=SOURCES.filter(s=>(s.title+" "+s.category+" "+s.url).toLowerCase().includes(q.toLowerCase())).map(item);
 try{const type=query&&query.type==="series"?"series":"movie";const docs=await archiveSearch(q,type);return matches.concat(docs.map(d=>archiveItem(d,type)));}catch(e){log("Search archive",e.message);return matches;}
}
async function archiveMetadata(id){
 const meta=await getJson(ARCHIVE+"/metadata/"+encodeURIComponent(id));
 if(!meta||!Array.isArray(meta.files))throw kino.error("not_found","No se encontraron archivos.");
 return meta;
}
function playableForOriginal(files,original){
 return files.find(f=>f.name===original.name&&/\.(mp4|m4v|webm)$/i.test(f.name)) ||
        files.find(f=>f.original===original.name&&/\.(mp4|m4v|webm)$/i.test(f.name)) || null;
}
export async function episodes(ref){
 if(!String(ref||"").startsWith("archive:"))throw kino.error("not_found","Esta fuente externa no ofrece capítulos que KBLLB pueda listar automáticamente.");
 const id=String(ref).slice(8).split("|")[0];
 const meta=await archiveMetadata(id);
 const originals=meta.files.filter(f=>f&&f.source==="original"&&typeof f.name==="string"&&/\.(mp4|m4v|webm|avi|mkv|mpg|mpeg|mov)$/i.test(f.name));
 const playable=originals.filter(f=>playableForOriginal(meta.files,f));
 if(!playable.length)throw kino.error("not_found","No hay capítulos en formatos compatibles en esta serie.");
 return {series:{title:String((meta.metadata&&meta.metadata.title)||id),poster:ARCHIVE+"/services/img/"+encodeURIComponent(id)},episodes:playable.slice(0,5000).map((f,i)=>{
  const name=f.name.split("/").pop();const m=/S(\d{1,3})E(\d{1,4})/i.exec(name);
  return {season:m?Number(m[1]):1,number:m?Number(m[2]):i+1,ref:"archive:"+id+"|"+f.name,title:String(f.title||name.replace(/\.[^.]+$/,""))};
 })};
}
async function archiveResolve(id,wanted){
 const meta=await archiveMetadata(id);
 const originals=meta.files.filter(f=>f&&f.source==="original"&&typeof f.name==="string"&&/\.(mp4|m4v|webm|avi|mkv|mpg|mpeg|mov)$/i.test(f.name));
 const original=wanted?originals.find(f=>f.name===wanted):originals.find(f=>playableForOriginal(meta.files,f));
 if(!original)throw kino.error("not_found","No se encontró el vídeo solicitado.");
 const f=playableForOriginal(meta.files,original);
 if(!f)throw kino.error("not_found","Internet Archive no ofrece un archivo compatible para este vídeo.");
 const seconds=Number(f.length||original.length||0);
 return {url:ARCHIVE+"/download/"+encodeURIComponent(id)+"/"+f.name.split("/").map(encodeURIComponent).join("/"),mime:/\.webm$/i.test(f.name)?"video/webm":"video/mp4",durationMs:seconds?Math.round(seconds*1000):undefined};
}
export async function resolve(ref){
 const value=String(ref||"");
 if(value.startsWith("archive:")){const raw=value.slice(8);const cut=raw.indexOf("|");return archiveResolve(cut<0?raw:raw.slice(0,cut),cut<0?null:raw.slice(cut+1));}
 if(!value.startsWith("source:"))throw kino.error("not_found","Referencia desconocida.");
 const s=sourceById(value.slice(7));if(!s)throw kino.error("not_found","Fuente desconocida.");
 let response;
 try{response=await kino.fetch(s.url);}catch(e){throw kino.error("not_found","No se pudo abrir la página de la fuente. Puede bloquear solicitudes desde Kino o requerir navegador: "+s.title);}
 if(!response.ok)throw kino.error("not_found","La fuente respondió HTTP "+response.status+".");
 let html="";try{html=await response.text();}catch(_){}
 const media=directMediaCandidates(html,s.url);
 if(media.length){const first=media[0];return {url:first,mime:/\.m3u8(?:$|[?#])/i.test(first)?"application/vnd.apple.mpegurl":/\.webm/i.test(first)?"video/webm":"video/mp4",label:mediaLabel(first),alternatives:media.slice(1,8).map(url=>({url,mime:/\.m3u8(?:$|[?#])/i.test(url)?"application/vnd.apple.mpegurl":/\.webm/i.test(url)?"video/webm":"video/mp4",label:mediaLabel(url)}))};
 // Optional Kino hidden-browser fallback. It can capture a page that itself starts playback,
 // but cannot turn a provider homepage into a title/episode catalogue.
 if(kino.browser&&typeof kino.browser.capture==="function"){
  try{
   const captured=await kino.browser.capture(s.url,{timeoutMs:18000});
   const streams=Array.isArray(captured.media)?captured.media:[];
   if(streams.length){
    const ranked=streams.filter(x=>x&&typeof x.url==="string"&&/^https:\/\//i.test(x.url)).sort((a,b)=>mediaScore(b.url)-mediaScore(a.url));
    if(ranked.length){const first=ranked[0];return {url:first.url,mime:first.mime,headers:first.headers,label:mediaLabel(first.url),alternatives:ranked.slice(1,8).map(x=>({url:x.url,mime:x.mime,headers:x.headers,label:mediaLabel(x.url)}))};}
   }
  }catch(e){log("Browser capture failed",s.title,e&&e.code||e&&e.message||"unknown");}
 }
 throw kino.error("not_found","No se encontró un vídeo directo en esta página. La tarjeta es una fuente externa, no una película individual. Para listar títulos y capítulos reales hace falta un adaptador específico para ese sitio.");
}
