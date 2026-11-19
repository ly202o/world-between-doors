import { DETAIL,FAR } from '../world/grid.js';
import * as fields from '../world/fields.js';
import { world } from '../world/state.js';
import { INST,exportObstacles,restoreObstacles } from '../objects/placement.js';
import { GRASS_OPS } from '../objects/grass.js';
import { WATERS } from '../water/water.js';
import {exportCustom,restoreCustom,exportGeometryCache,restoreGeometryCache} from '../objects/kinds.js';
import * as THREE from 'three';
export function capture(session){return {geometry:exportGeometryCache(),session,grids:[DETAIL,FAR].map(g=>({h:g.h,wear:g.wear})),fields:Object.fromEntries(Object.entries(fields).filter(([k,v])=>ArrayBuffer.isView(v))),world:{...world},inst:INST,water:WATERS,grass:GRASS_OPS,custom:exportCustom(),obstacles:exportObstacles()};}
export function restore(data,session){[DETAIL,FAR].forEach((g,i)=>{g.h.set(data.grids[i].h);g.wear.set(data.grids[i].wear)});for(const [k,v] of Object.entries(data.fields))fields[k].set(v);Object.assign(world,data.world,{waterDirty:false,waterTouched:false});Object.assign(INST,data.inst);Object.assign(WATERS,data.water);GRASS_OPS.push(...data.grass);restoreCustom(data.custom);restoreGeometryCache(data.geometry||{});restoreObstacles(data.obstacles);const report=session.report,cameras=session.cameras;Object.assign(report,data.session.report);cameras.push(...data.session.cameras);Object.assign(session,data.session,{report,cameras});}
export function encode(data){return JSON.stringify(data,function(k,v){let raw=this[k];if(ArrayBuffer.isView(raw)){let u=new Uint8Array(raw.buffer,raw.byteOffset,raw.byteLength);let bin='';for(let i=0;i<u.length;i+=8192)bin+=String.fromCharCode(...u.subarray(i,i+8192));return {$type:raw.constructor.name,data:btoa(bin)}}if(raw&&raw.isVector2)return {$vector2:[raw.x,raw.y]};if(raw&&raw.isVector3)return {$vector3:[raw.x,raw.y,raw.z]};return v;});}
export function decode(text){return JSON.parse(text,(k,v)=>{if(v&&v.$type){const b=atob(v.data),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return new globalThis[v.$type](a.buffer)}if(v&&v.$vector2)return new THREE.Vector2(...v.$vector2);if(v&&v.$vector3)return new THREE.Vector3(...v.$vector3);return v;});}
