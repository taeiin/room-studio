import fs from 'node:fs/promises';
import sharp from 'sharp';
import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {validateGlb} from '../lib/glb.ts';
globalThis.FileReader=class{readAsArrayBuffer(b){b.arrayBuffer().then(v=>{this.result=v;this.onloadend?.()})}};
const fabric=new T.MeshStandardMaterial({color:'#ffffff',roughness:.95});fabric.name='Oat beige boucle';
const steel=new T.MeshStandardMaterial({color:'#252621',metalness:.65,roughness:.45});
const wood=new T.MeshStandardMaterial({color:'#72513c',roughness:.55});
const thread=new T.MeshStandardMaterial({color:'#b4ab97',roughness:1});
let seed=91613;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
const pix=Buffer.alloc(512*512*3);for(let y=0;y<512;y++)for(let x=0;x<512;x++){const loop=Math.sin(x*1.4+Math.sin(y*.75)*2)*Math.cos(y*1.18+Math.sin(x*.55)),v=loop*9+(rand()-.5)*13;const i=(y*512+x)*3;pix[i]=211+v;pix[i+1]=205+v;pix[i+2]=191+v;}
const texture=await sharp(pix,{raw:{width:512,height:512,channels:3}}).png().toBuffer();
function block(g,name,x,y,z,w,h,d,mat=fabric,r=.025){const geo=new RoundedBoxGeometry(w,h,d,5,Math.min(r,w*.48,h*.48,d*.48));const uv=geo.getAttribute('uv');for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*Math.max(w,d)/.55,uv.getY(i)*Math.max(h,d)/.55);const m=new T.Mesh(geo,mat);m.name=name;m.position.set(x,y,z);g.add(m);return m}
function rod(g,a,b,r1=.013,r2=.009){const av=new T.Vector3(...a),bv=new T.Vector3(...b),dv=bv.clone().sub(av);const m=new T.Mesh(new T.CylinderGeometry(r1,r2,dv.length(),12),steel);m.position.copy(av.add(bv).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),dv.normalize());m.name='splayed black steel leg';g.add(m)}
function pillow(g,x,y,z,w,h,ry=0){const m=block(g,'included soft cushion',x,y,z,w,h,.14,fabric,.063);m.rotation.set(-.22,ry,.025*Math.sign(x));}
for(const variant of ['plain','right-tray','left-tray']){
 const g=new T.Group();g.name='Sysdesign Ella 4 seat oat beige '+variant;
 for(const sign of [-1,1]){
 const cx=sign*.726,outer=sign*1.35,tray=variant===(sign>0?'right-tray':'left-tray');
 block(g,'module upholstered base',cx,.209,0,1.448,.15,.95,fabric,.055);
 block(g,'rounded upholstered back',cx,.485,-.365,1.448,.50,.22,fabric,.095);
 block(g,'rounded outer arm',outer,.424,0,.20,.58,.95,fabric,.095);
 const seatW=tray?.985:1.235,seatX=tray?cx+sign*.105:cx-sign*.095;
 block(g,'single broad seat cushion',seatX,.338,.10,seatW,.144,.73,fabric,.061);
 // 250 x 670 x 50mm removable tray at the inner side of its module.
 if(tray){const tx=sign*.13;block(g,'walnut tray bottom',tx,.286,.12,.25,.025,.67,wood,.006);for(const xs of [-1,1])block(g,'tray raised long edge',tx+xs*.119,.305,.12,.012,.027,.67,wood,.004);for(const z of [-.209,.449])block(g,'tray raised short edge',tx,.305,z,.25,.027,.012,wood,.004)}
 for(const lx of [sign*.09,sign*1.29])for(const z of [-.36,.36])rod(g,[lx,.145,z],[lx+Math.sign(lx)*.024,0,z+Math.sign(z)*.022]);
 const seam=new T.Mesh(new T.BoxGeometry(1.38,.003,.002),thread);seam.position.set(cx,.266,.471);g.add(seam);
 if(tray){pillow(g,cx+sign*.25,.63,-.16,.53,.53,sign*.08);pillow(g,cx-sign*.18,.55,-.10,.59,.29,-sign*.1)}else for(const offset of [-.28,.28])pillow(g,cx+offset,.63,-.16,.53,.53,offset*.13);
 }
 // Scale to the published 2900 x 950 x 900mm envelope (height includes cushions).
 const b=new T.Box3().setFromObject(g),s=b.getSize(new T.Vector3());g.scale.set(2.9/s.x,.9/s.y,.95/s.z);g.position.y=-b.min.y*g.scale.y;
 g.userData={source:'https://sysdesign.co.kr/shop/sofa/material/fabric/ella_4s/',configuration:variant,dimensionsMm:[2900,950,900],seatHeightMm:410,color:'oat beige',note:'Upholstery and cushion softness approximated from manufacturer photos. Ottoman not included.'};
 const raw=Buffer.from(await new GLTFExporter().parseAsync(g,{binary:true})),len=raw.readUInt32LE(12),doc=JSON.parse(raw.subarray(20,20+len).toString());let bin=raw.subarray(28+len);const view=doc.bufferViews.length;doc.bufferViews.push({buffer:0,byteOffset:bin.length,byteLength:texture.length});bin=Buffer.concat([bin,texture,Buffer.alloc((4-texture.length%4)%4)]);doc.images=[{bufferView:view,mimeType:'image/png'}];doc.samplers=[{magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497}];doc.textures=[{sampler:0,source:0}];doc.materials[0].pbrMetallicRoughness.baseColorTexture={index:0};doc.buffers[0].byteLength=bin.length;let json=Buffer.from(JSON.stringify(doc));json=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]);const head=Buffer.alloc(20),bh=Buffer.alloc(8);head.writeUInt32LE(0x46546c67);head.writeUInt32LE(2,4);head.writeUInt32LE(28+json.length+bin.length,8);head.writeUInt32LE(json.length,12);head.writeUInt32LE(0x4e4f534a,16);bh.writeUInt32LE(bin.length);bh.writeUInt32LE(0x004e4942,4);const out=Buffer.concat([head,json,bh,bin]);validateGlb(out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength));await fs.writeFile(`public/models/sysdesign-ella-4s-${variant}.glb`,out);console.log({variant,bytes:out.length,bounds:new T.Box3().setFromObject(g).getSize(new T.Vector3()).toArray()});
}
