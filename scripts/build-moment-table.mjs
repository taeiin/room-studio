import fs from 'node:fs/promises';import sharp from 'sharp';import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';import {validateGlb} from '../lib/glb.ts';
globalThis.FileReader=class{readAsArrayBuffer(b){b.arrayBuffer().then(v=>{this.result=v;this.onloadend?.()})}};
const block=(g,name,x,y,z,w,h,d,mat,r=0)=>{const m=new T.Mesh(r?new RoundedBoxGeometry(w,h,d,4,r):new T.BoxGeometry(w,h,d),mat);m.name=name;m.position.set(x,y,z);g.add(m);return m};
// Horizontal rounded rectangle with independent 70mm plan radius and 10mm ceramic thickness.
function slab(g,y,h,mat){const w=2,d=.8,r=.07,s=new T.Shape();s.moveTo(-w/2+r,-d/2);s.lineTo(w/2-r,-d/2);s.quadraticCurveTo(w/2,-d/2,w/2,-d/2+r);s.lineTo(w/2,d/2-r);s.quadraticCurveTo(w/2,d/2,w/2-r,d/2);s.lineTo(-w/2+r,d/2);s.quadraticCurveTo(-w/2,d/2,-w/2,d/2-r);s.lineTo(-w/2,-d/2+r);s.quadraticCurveTo(-w/2,-d/2,-w/2+r,-d/2);const geo=new T.ExtrudeGeometry(s,{depth:h,bevelEnabled:false,curveSegments:12});geo.rotateX(-Math.PI/2);const m=new T.Mesh(geo,mat);m.position.y=y;m.name='rounded slab';g.add(m)}
for(const finish of ['natural','walnut','black'])for(const surface of ['white','beige']){
 const g=new T.Group();g.name=`Mondayhouse Moment 2000 ${finish} ${surface}`;
 const timber=new T.MeshStandardMaterial({color:'#ffffff',roughness:.63});timber.name='wood veneer';
 const ceramic=new T.MeshStandardMaterial({color:surface==='white'?'#f0eee7':'#d3c8b6',roughness:.6});
 // First material is timber for embedded wood grain below.
 slab(g,.712,.018,timber);slab(g,.73,.01,ceramic);
 for(const sign of [-1,1]){
  // Two thick vertical wings make each subtly V-shaped pedestal; angle inferred from photos.
  const apex=new T.Vector3(sign*.72,0,0);
  for(const z of [-.32,.32]){const end=new T.Vector3(sign*.56,0,z),mid=apex.clone().add(end).multiplyScalar(.5),delta=end.clone().sub(apex);const m=block(g,'thick veneer pedestal wing',mid.x,.36,mid.z,.04,.704,delta.length(),timber,.005);m.rotation.y=Math.atan2(delta.x,delta.z);}
  for(const z of [-.26,.26])block(g,'hidden floor glide',sign*.60,.004,z,.028,.008,.028,new T.MeshStandardMaterial({color:'#2b2924'}));
 }
 for(const z of [-.27,.27])block(g,'under tabletop apron',0,.68,z,1.38,.064,.027,timber,.006);
 const rgb=finish==='natural'?[177,139,89]:finish==='walnut'?[103,70,45]:[38,37,33];const pixels=Buffer.alloc(256*512*3);for(let y=0;y<512;y++)for(let x=0;x<256;x++){const v=x+2*Math.sin(y/60)+Math.sin(y/23+x/30),grain=4*Math.sin(v*.33)+2*Math.sin(v*1.9)+1.2*Math.sin(v*5)+2.2*Math.sin(x/41);const i=(y*256+x)*3;for(let n=0;n<3;n++)pixels[i+n]=rgb[n]+grain*(finish==='black'?.35:1)}const png=await sharp(pixels,{raw:{width:256,height:512,channels:3}}).png().toBuffer();
 g.userData={source:'https://store.ohou.se/goods/4187851',dimensionsMm:[2000,800,740],finish,surface,ceramicThicknessMm:10,note:'Dining table only, no chairs or bench. Pedestal angles and apron inferred from seller photos.'};
 const raw=Buffer.from(await new GLTFExporter().parseAsync(g,{binary:true})),len=raw.readUInt32LE(12),doc=JSON.parse(raw.subarray(20,20+len).toString());let bin=raw.subarray(28+len);const view=doc.bufferViews.length;doc.bufferViews.push({buffer:0,byteOffset:bin.length,byteLength:png.length});bin=Buffer.concat([bin,png,Buffer.alloc((4-png.length%4)%4)]);doc.images=[{bufferView:view,mimeType:'image/png'}];doc.samplers=[{magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497}];doc.textures=[{sampler:0,source:0}];doc.materials[0].pbrMetallicRoughness.baseColorTexture={index:0};doc.buffers[0].byteLength=bin.length;let json=Buffer.from(JSON.stringify(doc));json=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]);const head=Buffer.alloc(20),bh=Buffer.alloc(8);head.writeUInt32LE(0x46546c67);head.writeUInt32LE(2,4);head.writeUInt32LE(28+json.length+bin.length,8);head.writeUInt32LE(json.length,12);head.writeUInt32LE(0x4e4f534a,16);bh.writeUInt32LE(bin.length);bh.writeUInt32LE(0x004e4942,4);const out=Buffer.concat([head,json,bh,bin]);validateGlb(out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength));await fs.writeFile(`public/models/moment-2000-${finish}-${surface}.glb`,out);console.log({finish,surface,bytes:out.length,bounds:new T.Box3().setFromObject(g).getSize(new T.Vector3()).toArray()});
 const woodHex=finish==='natural'?'#b18b59':finish==='walnut'?'#67462d':'#262521',topHex=surface==='white'?'#f0eee7':'#d3c8b6';
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360"><rect width="480" height="360" fill="#eeece5"/><ellipse cx="240" cy="297" rx="185" ry="16" fill="#d6d0c4"/><g fill="'+woodHex+'" stroke="#705a42"><path d="M104 142V278L146 296V161Z"/><path d="M146 161L177 142V277L146 296Z"/><path d="M319 120V255L357 274V141Z"/><path d="M357 141L387 119V253L357 274Z"/><path d="M44 133L324 76Q333 74 340 78L432 112Q441 117 432 122L157 181Q148 183 141 179L48 143Q39 139 44 133Z"/></g><path d="M44 128L324 71Q333 69 340 73L432 107Q441 112 432 117L157 176Q148 178 141 174L48 138Q39 134 44 128Z" fill="'+topHex+'" stroke="#c8bfae"/></svg>';
 await fs.writeFile('public/models/moment-2000-'+finish+'-'+surface+'.svg',svg);

}
