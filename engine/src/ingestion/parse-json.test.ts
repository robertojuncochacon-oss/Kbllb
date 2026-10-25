import {describe,expect,it} from "vitest";
import {parseJsonLibrary} from "./parse-json.js";
import type {SourceConfig} from "../core/types.js";
const source:SourceConfig={id:"own",name:"Own",type:"json",url:"https://media.example/list.json",authorized:true,licenseNote:"own",pagination:"none",allowedHosts:["media.example"]};
describe("JSON parser",()=>{it("requires an explicit direct stream URL on an allowlisted host",()=>{const result=parseJsonLibrary({items:[{title:"Demo 720p",streamUrl:"https://media.example/demo.mp4",year:2020}]},source);expect(result).toHaveLength(1);expect(result[0]?.year).toBe(2020);expect(result[0]?.format).toBe("mp4");});it("does not treat metadata-only records as playable",()=>expect(parseJsonLibrary({items:[{title:"Metadata only"}]},source)).toHaveLength(0));});
