import {describe,expect,it} from "vitest";
import {parseM3U} from "./parse-m3u.js";
import type {SourceConfig} from "../core/types.js";
const source:SourceConfig={id:"own",name:"Own",type:"m3u",url:"https://media.example/list.m3u",authorized:true,licenseNote:"own",pagination:"none",allowedHosts:["media.example"]};
describe("M3U parser",()=>{it("parses allowlisted direct stream and metadata",()=>{const result=parseM3U("#EXTM3U\n#EXTINF:-1,Demo Movie 1080p LATINO\nhttps://media.example/demo.mp4",source);expect(result).toHaveLength(1);expect(result[0]?.title).toContain("Demo Movie");expect(result[0]?.quality).toBe(1080);expect(result[0]?.language).toBe("es");});it("rejects non-allowlisted hosts",()=>expect(parseM3U("#EXTINF:-1,Demo\nhttps://other.example/a.mp4",source)).toHaveLength(0));});
