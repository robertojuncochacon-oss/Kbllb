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
function directMedia(html,pageUrl){
 const candidates=[];
 const patterns=[
  /<video\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/ig,
  /<source\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/ig,
  /<meta\b[^>]*(?:property|name)\s*=\s*["'](?:og:video|og:video:url|twitter:player:stream)["'][^>]*content\s*=\s*["']([^"']+)["']/ig,
  /<meta\b[^>]*content\s*=\s*["']([^"']+)["'][^>]*(?:property|name)\s*=\s*["'](?:og:video|og:video:url|twitter:player:stream)["']/ig
 ];
 for(const re of patterns){let m;while((m=re.exec(html))!==null){try{const u=new URL(m[1].replace(/&amp;/g,"&"),pageUrl);if(u.protocol==="https:"&&/\.(mp4|m4v|webm|m3u8)(?:$|[?#])/i.test(u.href))candidates.push(u.href);}catch(_){}}}
 return candidates.find(u=>/\.mp4(?:$|[?#])/i.test(u))||candidates.find(u=>/\.(m4v|webm)(?:$|[?#])/i.test(u))||candidates.find(u=>/\.m3u8(?:$|[?#])/i.test(u))||null;
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
async function archiveResolve(id){
 const meta=await getJson(ARCHIVE+"/metadata/"+encodeURIComponent(id));
 if(!meta||!Array.isArray(meta.files))throw kino.error("not_found","No se encontraron archivos.");
 const f=meta.files.filter(x=>x&&typeof x.name==="string"&&/\.(mp4|m4v|webm)$/i.test(x.name)&&x.source==="original").sort((a,b)=>(/\.mp4$/i.test(a.name)?0:1)-(/\.mp4$/i.test(b.name)?0:1))[0];
 if(!f)throw kino.error("not_found","Internet Archive no ofrece un archivo MP4/M4V/WebM original compatible para este título.");
 return {url:ARCHIVE+"/download/"+encodeURIComponent(id)+"/"+f.name.split("/").map(encodeURIComponent).join("/"),mime:/\.webm$/i.test(f.name)?"video/webm":"video/mp4"};
}
export async function resolve(ref){
 const value=String(ref||"");
 if(value.startsWith("archive:")){
  const raw=value.slice(8);const cut=raw.indexOf("|");
  return archiveResolve(cut<0?raw:raw.slice(0,cut),cut<0?null:raw.slice(cut+1));
 }
 if(!value.startsWith("source:"))throw kino.error("not_found","Referencia desconocida.");
 const s=sourceById(value.slice(7));if(!s)throw kino.error("not_found","Fuente desconocida.");
 let response;
 try{response=await kino.fetch(s.url);}catch(e){throw kino.error("not_found","No se pudo abrir la página de la fuente. Puede bloquear solicitudes desde Kino o requerir navegador: "+s.title);}
 if(!response.ok)throw kino.error("not_found","La fuente respondió HTTP "+response.status+".");
 let html="";try{html=await response.text();}catch(_){}
 const media=directMedia(html,s.url);
 if(!media)throw kino.error("not_found","Esta página no expone un enlace directo MP4/M4V/WebM/HLS compatible. KBLLB no elude DRM, inicio de sesión ni reproductores protegidos. Abre la fuente en el navegador o usa una URL de vídeo directa autorizada.");
 return {url:media,mime:/\.m3u8(?:$|[?#])/i.test(media)?"application/vnd.apple.mpegurl":/\.webm/i.test(media)?"video/webm":"video/mp4"};
}
