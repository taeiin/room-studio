import fs from 'node:fs/promises';
import * as T from 'three';
import sharp from 'sharp';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {validateGlb} from '../lib/glb.ts';
globalThis.FileReader=class{readAsArrayBuffer(b){b.arrayBuffer().then(v=>{this.result=v;this.onloadend?.()})}};
const dir='public/models';await fs.mkdir(dir,{recursive:true});
const box=(g,name,w,h,d,x,y,z,mat)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.name=name;m.position.set(x,y,z);g.add(m);return m};
const align=b=>Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)]);
async function write(g,path,images=[]){
 const bounds=new T.Box3().setFromObject(g),size=bounds.getSize(new T.Vector3());
 const raw=Buffer.from(await new GLTFExporter().parseAsync(g,{binary:true}));let result=raw;
 if(images.length){const len=raw.readUInt32LE(12),doc=JSON.parse(raw.subarray(20,20+len).toString());let bin=raw.subarray(28+len);doc.images=[];doc.textures=[];doc.samplers=[{magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497}];
 for(const [i,png]of images.entries()){const view=doc.bufferViews.length;doc.bufferViews.push({buffer:0,byteOffset:bin.length,byteLength:png.length});bin=Buffer.concat([bin,align(png)]);doc.images.push({bufferView:view,mimeType:'image/png'});doc.textures.push({sampler:0,source:i});doc.materials[i].pbrMetallicRoughness.baseColorTexture={index:i};}
 doc.buffers[0].byteLength=bin.length;let json=Buffer.from(JSON.stringify(doc));json=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]);const header=Buffer.alloc(20),bh=Buffer.alloc(8);header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(28+json.length+bin.length,8);header.writeUInt32LE(json.length,12);header.writeUInt32LE(0x4e4f534a,16);bh.writeUInt32LE(bin.length);bh.writeUInt32LE(0x004e4942,4);result=Buffer.concat([header,json,bh,bin]);}
 validateGlb(result.buffer.slice(result.byteOffset,result.byteOffset+result.byteLength));await fs.writeFile(`${dir}/${path}.glb`,result);console.log({path,bytes:result.length,bounds:size.toArray()});
}
// Havel: specified envelope and 23T slab, V-shaped panel supports reconstructed from photos.
const desk=new T.Group();desk.name='Casamia Havel 150 Natural';
const timberTop=new T.MeshStandardMaterial({color:'#ffffff',roughness:.64});timberTop.name='Natural maple horizontal grain';
const timberLeg=new T.MeshStandardMaterial({color:'#ffffff',roughness:.64});timberLeg.name='Natural maple vertical grain';
box(desk,'23mm tabletop',1.5,.023,.75,0,.7085,0,timberTop);
for(const sign of [-1,1])for(const front of [-1,1]){const a=new T.Vector3(sign*.629,0,0),b=new T.Vector3(sign*.418,0,front*.308),mid=a.clone().add(b).multiplyScalar(.5),delta=b.clone().sub(a);const panel=box(desk,'V support wing',.023,.689,delta.length(),mid.x,.3525,mid.z,timberLeg);panel.rotation.y=Math.atan2(delta.x,delta.z);for(const p of [a,b])box(desk,'floor glide',.02,.008,.02,p.x,.004,p.z,new T.MeshStandardMaterial({color:'#38332a'}));}
box(desk,'rear support rail',1.22,.065,.023,0,.656,-.24,timberLeg);
desk.userData={source:'https://store.ohou.se/goods/3277631',dimensionsMm:[1500,750,720],finish:'natural',note:'V support angles inferred from product photos.'};
const pixels=Buffer.alloc(512*512*3);for(let y=0;y<512;y++)for(let x=0;x<512;x++){const warp=y+2*Math.sin(x/100)+1.5*Math.sin(x/37+y/47);const v=5*Math.sin(warp*.3)+2*Math.sin(warp*1.8)+1.7*Math.sin(warp*4.9)+3*Math.sin(y/48)+1.3*Math.sin(x*7+y*13);const i=(y*512+x)*3;pixels[i]=Math.round(190+v);pixels[i+1]=Math.round(153+v);pixels[i+2]=Math.round(100+v*.8)}
const horizontal=await sharp(pixels,{raw:{width:512,height:512,channels:3}}).png().toBuffer();const vertical=await sharp(horizontal).rotate(90).png().toBuffer();await write(desk,'casamia-havel-150-natural',[horizontal,vertical]);
// Tom single: soft continuous shell, depressed seat, raised arms, high pillow back and piping.
const bean=new T.Group();bean.name='Plegia Tom Soft Single French Black';
const leather=new T.MeshStandardMaterial({color:'#202120',roughness:.57,metalness:.02});
const seam=new T.MeshStandardMaterial({color:'#363732',roughness:.77});
const smooth=(a,b,x)=>{let t=T.MathUtils.clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
function pos(r,a){const c=Math.cos(a),s=Math.sin(a),x=.4*r*Math.sign(c)*Math.abs(c)**.56,z=.425*r*Math.sign(s)*Math.abs(s)**.56;const back=smooth(.03,.78,-z/.425),side=(Math.abs(x)/.4)**7;let y=.33+.44*back+.175*side*(1-.72*back)+.025*smooth(.5,1,z/.425);y-=.026*Math.exp(-((x/.24)**2+((z-.05)/.21)**2));y+=.004*Math.sin(a*12+r*18)*r**6;return new T.Vector3(x,y,z)}
const points=[],index=[],N=128,R=36;for(let j=0;j<=R;j++)for(let n=0;n<=N;n++){const p=pos(j/R,n/N*Math.PI*2);points.push(...p.toArray())}for(let j=0;j<R;j++)for(let n=0;n<N;n++){const a=j*(N+1)+n,b=a+N+1;index.push(a,a+1,b,a+1,b+1,b)}
const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(points,3));geo.setIndex(index);geo.computeVertexNormals();const topMesh=new T.Mesh(geo,leather);topMesh.name='soft seat arms and pillow back';bean.add(topMesh);
const sidePos=[],sideIdx=[],L=24;for(let j=0;j<=L;j++)for(let n=0;n<=N;n++){const t=j/L,a=n/N*Math.PI*2,p=pos(1,a),bulge=.91+.09*Math.sin(Math.PI*t);sidePos.push(p.x*bulge,.025+(p.y-.025)*t,p.z*bulge)}for(let j=0;j<L;j++)for(let n=0;n<N;n++){const a=j*(N+1)+n,b=a+N+1;sideIdx.push(a,b,a+1,a+1,b,b+1)}const sg=new T.BufferGeometry();sg.setAttribute('position',new T.Float32BufferAttribute(sidePos,3));sg.setIndex(sideIdx);sg.computeVertexNormals();const shell=new T.Mesh(sg,leather);shell.name='bulging leather outer shell';bean.add(shell);
function piping(name,pts,closed=false,r=.0018){const curve=new T.CatmullRomCurve3(pts,closed);const m=new T.Mesh(new T.TubeGeometry(curve,Math.max(32,pts.length*2),r,6,closed),seam);m.name=name;bean.add(m)}
piping('perimeter sewn piping',Array.from({length:128},(_,n)=>pos(.995,n/128*Math.PI*2).add(new T.Vector3(0,.002,0))),true);
for(const a of [Math.PI*.25,Math.PI*.75,Math.PI*1.25,Math.PI*1.75]){const p=pos(1,a);piping('panel seam',Array.from({length:25},(_,n)=>{const t=n/24,b=.91+.09*Math.sin(Math.PI*t);return new T.Vector3(p.x*b*1.003,.025+(p.y-.025)*t,p.z*b*1.003)}))}
for(const sign of [-1,1])piping('seat side seam',Array.from({length:33},(_,n)=>{const z=-.25+n/32*.57,x=sign*(.25+.035*Math.sin(n/32*Math.PI));const a=Math.atan2(z/.425,x/.4);let lo=0,hi=1;for(let k=0;k<15;k++){let mid=(lo+hi)/2;if(Math.abs(pos(mid,a).x)<Math.abs(x))lo=mid;else hi=mid}return pos((lo+hi)/2,a).add(new T.Vector3(0,.002,0))}));
box(bean,'underside fabric',.64,.02,.66,0,.025,0,new T.MeshStandardMaterial({color:'#131513',roughness:1}));
const bb=new T.Box3().setFromObject(bean),sz=bb.getSize(new T.Vector3());bean.scale.set(.8/sz.x,.82/sz.y,.85/sz.z);bean.position.y=-bb.min.y*bean.scale.y;
bean.userData={source:'https://store.ohou.se/goods/1143187',dimensionsMm:[800,850,820],finish:'French Black',note:'Soft filled chair silhouette and seams approximated from product photographs; shape changes with use.'};await write(bean,'tom-soft-single-black');
