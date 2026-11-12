import fs from 'node:fs/promises';
import * as T from 'three';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {validateGlb} from '../lib/glb.ts';
globalThis.FileReader=class{readAsArrayBuffer(b){b.arrayBuffer().then(v=>{this.result=v;this.onloadend?.()})}};
const g=new T.Group();g.name='Urbanraft Grid 1200 shelf 4 drawer';
const white=new T.MeshStandardMaterial({color:'#ecebe5',roughness:.42});
const chrome=new T.MeshStandardMaterial({color:'#b8bdc1',metalness:.88,roughness:.21});
const dark=new T.MeshStandardMaterial({color:'#454743',roughness:.8});
function box(name,x,y,z,w,h,d,mat=white){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.name=name;m.position.set(x,y,z);g.add(m)}
function rod(name,a,b,r=.007){const av=new T.Vector3(...a),bv=new T.Vector3(...b),delta=bv.clone().sub(av);const m=new T.Mesh(new T.CylinderGeometry(r,r,delta.length(),16),chrome);m.name=name;m.position.copy(av.add(bv).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());g.add(m)}
// Published envelope: 1200 W x 400 D x 940 H mm. Shelf opening 125mm, legs 60mm.
// Thin frame, drawer reveals and handle sizes reconstructed visually from product photography.
for(const y of [.069,.438,.799,.932])box('horizontal panel',0,y,0,1.2,.016,.4);
box('left side',-.584,.434,0,.016,.714,.366);box('right side',.584,.434,0,.016,.714,.366);
box('back',0,.434,-.183,1.152,.714,.016);
box('center divider',0,.434,0,.016,.714,.366);
for(const y of [.251,.615])for(const x of [-.299,.299]){
 box('drawer interior shadow',x,y,.175,.58,.347,.016,dark);
 box('drawer front',x,y,.184,.578,.345,.016);
 // A shallow cylindrical metal pull with a small stem, facing +Z.
 rod('pull stem',[x,y+.105,.192],[x,y+.105,.202],.005);
 rod('round pull',[x,y+.105,.201],[x,y+.105,.209],.009);
}
for(const x of [-.589,0,.589])for(const z of [-.189,.189]){
 rod('leg',[x,.008,z],[x,.069,z],.009);
 rod('cabinet post',[x,.069,z],[x,.806,z]);
 rod('shelf post',[x,.806,z],[x,.94,z],.006);
}
for(const y of [.077,.438,.797,.932]){
 for(const z of [-.193,.193])rod('horizontal chrome rail',[-.59,y,z],[.59,y,z],.005);
 for(const x of [-.593,.593])rod('side chrome rail',[x,y,-.19],[x,y,.19],.005);
}
const b=new T.Box3().setFromObject(g),size=b.getSize(new T.Vector3());
g.userData={source:'https://store.ohou.se/goods/3817282',dimensionsMm:[1200,400,940],finish:'soft white',note:'Geometry reconstructed from product images; internal details approximate.'};
const out=await new GLTFExporter().parseAsync(g,{binary:true});validateGlb(out);
await fs.mkdir('public/models',{recursive:true});await fs.writeFile('public/models/urbanraft-grid-1200-white.glb',Buffer.from(out));
console.log(JSON.stringify({meshes:g.children.length,bounds:size.toArray(),bytes:out.byteLength}));
