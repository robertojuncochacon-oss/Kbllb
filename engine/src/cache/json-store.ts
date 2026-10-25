import {mkdir,readFile,rename,writeFile} from "node:fs/promises";import {dirname} from "node:path";
export async function readJson<T>(path:string,fallback:T):Promise<T>{try{return JSON.parse(await readFile(path,"utf8")) as T;}catch(e){if(typeof e==="object"&&e!==null&&"code" in e&&e.code==="ENOENT")return fallback;throw e;}}
export async function writeJsonAtomic<T>(path:string,value:T):Promise<void>{await mkdir(dirname(path),{recursive:true});const tmp=path+".tmp";await writeFile(tmp,JSON.stringify(value,null,2)+"\n","utf8");await rename(tmp,path);}
