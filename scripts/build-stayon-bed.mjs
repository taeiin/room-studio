import fs from 'node:fs/promises';
import * as T from 'three';
import sharp from 'sharp';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {validateGlb} from '../lib/glb.ts';
globalThis.FileReader=class{readAsArrayBuffer(b){b.arrayBuffer().then(v=>{this.result=v;this.onloadend?.()})}};
const g=new T.Group();g.name='Scandia Stayon LK Oak with two 400 drawer panels';
const oak=new T.MeshStandardMaterial({color:'#ffffff',roughness:.65});oak.name='Oak LPM horizontal grain';
const edge=new T.MeshStandardMaterial({color:'#a77d4f',roughness:.72});
const dark=new T.MeshStandardMaterial({color:'#4d3c29',roughness:.85});
function box(name,x,y,z,w,h,d,mat=oak,round=0){const m=new T.Mesh(round?new RoundedBoxGeometry(w,h,d,4,round):new T.BoxGeometry(w,h,d),mat);m.name=name;m.position.set(x,y,z);g.add(m);return m}
// Exact overall envelope 2650 x 2170 x 990mm. Headboard depth 120mm, deck depth 2050mm.
// +Z is the foot of the bed. Frame-only; mattress is not part of the selected product.
box('LK headboard 1850',0,.495,-1.025,1.85,.99,.12);
box('headboard front reveal',0,.495,-.963,1.846,.984,.004,oak);
box('recessed dark plinth',0,.022,.06,1.72,.044,1.93,dark);
box('left bed base',-.448,.126,.06,.888,.174,1.98);
box('right bed base',.448,.126,.06,.888,.174,1.98);
box('platform 1850 x 2050',0,.229,.06,1.85,.032,2.05,oak,.025);
box('foot center joint',0,.129,1.052,.003,.169,.002,dark);
for(const sign of [-1,1]){
 const x=sign*1.125;
 box('400 general side panel',x,.495,-1.025,.4,.99,.12);
 box('400 two drawer cabinet carcass',x,.2295,-.765,.4,.435,.4);
 box('drawer shadow reveal',x,.222,-.562,.37,.011,.003,dark);
 box('lower drawer front',x,.117,-.563,.392,.196,.016);
 box('upper drawer front',x,.329,-.563,.392,.196,.016);
 box('cabinet top',x,.438,-.765,.4,.018,.4);
 box('bottom recessed foot',x,.007,-.765,.36,.014,.36,dark);
}
g.userData={source:'https://store.ohou.se/goods/4115995',configuration:'LK frame + left/right 400 general panels + two 400 two-drawer cabinets',finish:'oak',dimensionsMm:[2650,2170,990],bedFrameMm:[1850,2170,990],drawerMm:[400,400,447],panelMm:[400,120,990],note:'Frame only, no mattress or optional lights. Small reveals inferred from product photography.'};
const pixels=Buffer.alloc(1024*512*3);for(let y=0;y<512;y++)for(let x=0;x<1024;x++){const v=y+2.5*Math.sin(x/120)+2*Math.sin(x/47+y/53),grain=5*Math.sin(v*.32)+2.3*Math.sin(v*1.7)+1.5*Math.sin(v*5)+4*Math.sin(y/41)+1.4*Math.sin(x*7+y*13);let knot=0;for(const [cx,cy]of[[240,110],[760,370]]){const r=Math.sqrt(((x-cx)/5)**2+((y-cy)*1.4)**2);knot+=3*Math.sin(r*.45)*Math.exp(-r/35)}const i=(y*1024+x)*3;pixels[i]=182+grain+knot;pixels[i+1]=145+grain+knot;pixels[i+2]=98+grain*.8+knot}
const png=await sharp(pixels,{raw:{width:1024,height:512,channels:3}}).png().toBuffer();
const raw=Buffer.from(await new GLTFExporter().parseAsync(g,{binary:true})),len=raw.readUInt32LE(12),doc=JSON.parse(raw.subarray(20,20+len).toString());let bin=raw.subarray(28+len);const view=doc.bufferViews.length;doc.bufferViews.push({buffer:0,byteOffset:bin.length,byteLength:png.length});bin=Buffer.concat([bin,png,Buffer.alloc((4-png.length%4)%4)]);doc.images=[{bufferView:view,mimeType:'image/png'}];doc.samplers=[{magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497}];doc.textures=[{sampler:0,source:0}];doc.materials[0].pbrMetallicRoughness.baseColorTexture={index:0};doc.buffers[0].byteLength=bin.length;let json=Buffer.from(JSON.stringify(doc));json=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]);const header=Buffer.alloc(20),bh=Buffer.alloc(8);header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(28+json.length+bin.length,8);header.writeUInt32LE(json.length,12);header.writeUInt32LE(0x4e4f534a,16);bh.writeUInt32LE(bin.length);bh.writeUInt32LE(0x004e4942,4);const out=Buffer.concat([header,json,bh,bin]);validateGlb(out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength));await fs.writeFile('public/models/scandia-stayon-lk-oak-400-drawers.glb',out);const size=new T.Box3().setFromObject(g).getSize(new T.Vector3());console.log({bytes:out.length,bounds:size.toArray(),parts:g.children.length});
