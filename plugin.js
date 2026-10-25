// KBLLB Media Index — Kino TV plugin.
// Directory cards point to external sites; playback is implemented only for Internet Archive
// items that provide a direct MP4/M4V/WebM file. This plugin does not scrape third-party players.

const ARCHIVE = "https://archive.org";
const SOURCES = [
  { id:"fly-stream", title:"Fly Stream", category:"Películas y series", url:"https://share.google/gmMvOn5uR4aExEUBK", note:"Enlace compartido; puede redirigir." },
  { id:"bingebang", title:"BingeBang", category:"Películas y series", url:"https://zoechip.bz/home" },
  { id:"cinebros", title:"Cinebros", category:"Películas y series", url:"https://cinebros.net/" },
  { id:"zenox", title:"Zenox", category:"Películas y series", url:"https://zenox.lol/" },
  { id:"redflix", title:"Redflix", category:"Películas y series", url:"https://redflix.one/" },
  { id:"nexa", title:"Nexa", category:"Películas y series", url:"https://nexa.mov/" },
  { id:"flixer", title:"Flixer", category:"Películas y series", url:"https://flixer.gd/" },
  { id:"boredflix", title:"Boredflix", category:"Películas y series", url:"https://boredflix.to/" },
  { id:"anichi", title:"Anichi", category:"Anime y animación", url:"https://anichi.to/home" },
  { id:"animesalt", title:"AnimeSalt", category:"Anime y animación", url:"https://animesalt.to/" },
  { id:"anihq", title:"AniHQ", category:"Anime y animación", url:"https://anihq.org/home" },
  { id:"mirrors", title:"Mirrors", category:"Anime y animación", url:"https://mirrors.st/" },
  { id:"wcostream", title:"WatchCartoonOnline", category:"Anime y animación", url:"https://www.wcostream.org/" },
  { id:"kisscartoon", title:"KissCartoon", category:"Anime y animación", url:"https://kisscartoon.nz/" },
  { id:"kimcartoon", title:"KimCartoon", category:"Anime y animación", url:"https://kimcartoon.li/" },
  { id:"gostreameast", title:"GoStreamEast", category:"Deportes y TV en directo", url:"https://gostreameast.link/" },
  { id:"strmd", title:"Strmd", category:"Deportes y TV en directo", url:"https://strmd.link/" },
  { id:"thetvapp", title:"TheTVApp", category:"Deportes y TV en directo", url:"https://thetvapp.st/" },
  { id:"aurasports", title:"AuraSports", category:"Deportes y TV en directo", url:"https://aurasports.xyz/" },
  { id:"damitv", title:"DamiTV", category:"Deportes y TV en directo", url:"https://damitv.st/" },
  { id:"footballia", title:"Footballia", category:"Deportes y TV en directo", url:"https://footballia.net/" },
  { id:"mlblive", title:"MLB Live", category:"Deportes y TV en directo", url:"https://mlblive.net/" },
  { id:"timesoccertv", title:"Time Soccer TV", category:"Deportes y TV en directo", url:"https://timesoccertv.com/" },
  { id:"documentarymania", title:"Documentary Mania", category:"Documentales y archivos", url:"https://www.documentarymania.com/" },
  { id:"documentarytube", title:"Documentary Tube", category:"Documentales y archivos", url:"https://www.documentarytube.com/" },
  { id:"archive-org", title:"Internet Archive", category:"Documentales y archivos", url:"https://archive.org/", note:"Fuente principal con búsqueda y reproducción directa de archivos compatibles." },
  { id:"fmhy-video", title:"FMHY · Video Tools", category:"Herramientas y referencias", url:"https://fmhy.net/video-tools/#video-download" },
  { id:"fmhy-downloading", title:"FMHY · Downloading", category:"Herramientas y referencias", url:"https://fmhy.net/downloading" },
  { id:"leonflix", title:"Leonflix", category:"Herramientas y referencias", url:"https://leonflix.net/" },
  { id:"wget", title:"GNU Wget", category:"Herramientas y referencias", url:"https://www.gnu.org/software/wget/" },
  { id:"orionoid", title:"Orionoid", category:"Herramientas y referencias", url:"https://orionoid.com/" },
  { id:"sanet", title:"Sanet", category:"Herramientas y referencias", url:"https://sanet.st/full/" },
  { id:"hatt-github", title:"Hatt · GitHub", category:"Herramientas y referencias", url:"https://github.com/FrenchGithubUser/Hatt" }
];

const CATEGORIES = [
  { id:"movies", title:"Películas y series", match:"Películas y series" },
  { id:"anime", title:"Anime y animación", match:"Anime y animación" },
  { id:"sports", title:"Deportes y TV en directo", match:"Deportes y TV en directo" },
  { id:"docs", title:"Documentales y archivos", match:"Documentales y archivos" },
  { id:"tools", title:"Herramientas y referencias", match:"Herramientas y referencias" }
];

function sourceItem(s) {
  return {
    id: "source-" + s.id,
    ref: "source:" + s.id,
    title: s.title,
    kind: "movie",
    overview: s.category + " · Enlace externo: " + s.url + (s.note ? " · " + s.note : "")
  };
}

function cleanQuery(q) {
  return String((q && (q.q || q.query || q.title)) || "").trim().toLowerCase();
}
function logSafe(...args) {
  try { kino.log(...args); } catch (_) {}
}
async function getJson(url) {
  const response = await kino.fetch(url);
  if (!response.ok) throw new Error("Internet Archive respondió HTTP " + response.status);
  return response.json();
}
function archiveItem(doc) {
  return {
    id: "archive-" + doc.identifier,
    ref: "archive:" + doc.identifier,
    title: String(Array.isArray(doc.title) ? doc.title[0] : (doc.title || doc.identifier)),
    kind: "movie",
    year: doc.year ? String(Array.isArray(doc.year) ? doc.year[0] : doc.year) : undefined,
    poster: ARCHIVE + "/services/img/" + encodeURIComponent(doc.identifier),
    overview: String(Array.isArray(doc.description) ? doc.description.join(" ") : (doc.description || "Vídeo alojado en Internet Archive.")).replace(/<[^>]*>/g, "").slice(0, 350)
  };
}
async function archiveSearch(q) {
  const url = ARCHIVE + "/advancedsearch.php?q=" + encodeURIComponent("title:(" + q + ") AND mediatype:(movies)") +
    "&fl[]=identifier&fl[]=title&fl[]=year&fl[]=description&rows=20&page=1&output=json";
  const data = await getJson(url);
  return data && data.response && Array.isArray(data.response.docs) ? data.response.docs : [];
}
function sourceById(id) { return SOURCES.find(s => s.id === id); }
function categoryItems(id) {
  const c = CATEGORIES.find(x => x.id === id);
  if (!c) return [];
  return SOURCES.filter(s => s.category === c.match).map(sourceItem);
}

export async function home() {
  const rows = CATEGORIES.map(c => ({
    id: c.id, ref: c.id, title: c.title, items: categoryItems(c.id)
  }));
  // A separate row for licensed/public-domain playable material from Internet Archive.
  try {
    const docs = await archiveSearch("documentary");
    rows.push({
      id: "archive-docs", ref: "archive-docs", title: "Documentales en Internet Archive",
      items: docs.map(archiveItem)
    });
  } catch (e) {
    logSafe("No se pudo cargar la fila de Internet Archive:", e && e.message);
  }
  return rows;
}

export async function browse(ref, cursor) {
  await null; // Keep errors asynchronous for Kino's error boundary.
  const c = CATEGORIES.find(x => x.id === ref);
  if (c) return { items: categoryItems(ref), next: undefined };
  if (ref === "archive-docs") {
    const page = Math.max(1, Number(cursor) || 1);
    const url = ARCHIVE + "/advancedsearch.php?q=" + encodeURIComponent("mediatype:(movies) AND (subject:documentary OR title:documentary)") +
      "&fl[]=identifier&fl[]=title&fl[]=year&fl[]=description&rows=30&page=" + page + "&output=json";
    const data = await getJson(url);
    const docs = data && data.response && Array.isArray(data.response.docs) ? data.response.docs : [];
    return { items: docs.map(archiveItem), next: docs.length === 30 ? String(page + 1) : undefined };
  }
  throw kino.error("not_found", "No existe esa categoría.");
}

export async function search(query) {
  const q = cleanQuery(query);
  if (!q) return SOURCES.map(sourceItem);
  const words = q.split(/\s+/).filter(Boolean);
  const directoryMatches = SOURCES.filter(s =>
    (s.title + " " + s.category + " " + s.url + " " + (s.note || "")).toLowerCase().includes(q) ||
    words.every(w => (s.title + " " + s.category + " " + s.url).toLowerCase().includes(w))
  ).map(sourceItem);
  let archiveMatches = [];
  try {
    archiveMatches = (await archiveSearch(q)).map(archiveItem);
  } catch (e) {
    logSafe("Búsqueda de Internet Archive falló:", e && e.message);
  }
  const seen = new Set(directoryMatches.map(x => x.id));
  return directoryMatches.concat(archiveMatches.filter(x => !seen.has(x.id)));
}

async function metadata(id) {
  const data = await getJson(ARCHIVE + "/metadata/" + encodeURIComponent(id));
  if (!data || !Array.isArray(data.files)) throw new Error("No se encontró el contenido en Internet Archive.");
  return data;
}
function playableFile(files) {
  const candidates = files.filter(f => f && typeof f.name === "string" && /\.(mp4|m4v|webm)$/i.test(f.name) && f.source === "original");
  candidates.sort((a,b) => {
    const rank = f => /\.mp4$/i.test(f.name) ? 0 : (/\.m4v$/i.test(f.name) ? 1 : 2);
    return rank(a)-rank(b);
  });
  return candidates[0];
}
export async function resolve(ref) {
  if (!String(ref).startsWith("archive:")) {
    throw kino.error("not_found", "Este resultado es un enlace externo, no un vídeo reproducible dentro de Kino. Abre el enlace indicado en la descripción.");
  }
  const id = String(ref).slice("archive:".length);
  const meta = await metadata(id);
  const file = playableFile(meta.files);
  if (!file) throw kino.error("not_found", "Este elemento de Internet Archive no contiene un MP4, M4V o WebM original compatible.");
  const url = ARCHIVE + "/download/" + encodeURIComponent(id) + "/" + file.name.split("/").map(encodeURIComponent).join("/");
  return { url, mime: /\.webm$/i.test(file.name) ? "video/webm" : "video/mp4" };
}
