import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as T from 'three';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {validateGlb} from '../lib/glb.ts';
globalThis.FileReader=class{readAsArrayBuffer(b){b.arrayBuffer().then(v=>{this.result=v;this.onloadend?.()})}};
const g=new T.Group();for(const [x,y,z,w,h,d,col]of[[0,.5,0,.9,.2,.9,0x496d8a],[0,1,-.4,.9,.8,.12,0x496d8a],[-.35,.2,-.3,.08,.4,.08,0x78583c],[.35,.2,-.3,.08,.4,.08,0x78583c],[-.35,.2,.3,.08,.4,.08,0x78583c],[.35,.2,.3,.08,.4,.08,0x78583c]]){const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color:col}));m.position.set(x,y,z);g.add(m)}
const glb=await new GLTFExporter().parseAsync(g,{binary:true});assert.ok(glb instanceof ArrayBuffer);validateGlb(glb);await fs.writeFile('../qa-chair.glb',Buffer.from(glb));assert.throws(()=>validateGlb(new ArrayBuffer(5)));
const root='http://127.0.0.1:5173';const login=await fetch(root+'/signin-with-chatgpt?return_to=/',{redirect:'manual'});const Cookie=login.headers.get('set-cookie').split(';')[0];const headers={Cookie};
assert.equal((await fetch(root+'/api/models')).status,401);
const config=await(await fetch(root+'/api/models',{headers})).json();assert.equal(config.mode,"free-local");
const noKey=await fetch(root+'/api/models',{method:'POST',headers:{Cookie,'Content-Type':'application/json'},body:JSON.stringify({id:crypto.randomUUID(),itemId:'chair',images:[]})});assert.equal(noKey.status,410);assert.equal((await noKey.json()).code,'PAID_DISABLED');
const form=new FormData();form.append('itemId','qa-chair');form.append('file',new Blob([glb],{type:'model/gltf-binary'}),'qa-chair.glb');const uploaded=await fetch(root+'/api/models/import',{method:'POST',headers,body:form});assert.equal(uploaded.status,200);const {model}=await uploaded.json();const read=await fetch(root+model.url,{headers});assert.equal(read.status,200);assert.equal(read.headers.get('content-type'),'model/gltf-binary');validateGlb(await read.arrayBuffer());assert.equal((await fetch(root+model.url)).status,401);
const job=await(await fetch(root+'/api/models/'+model.jobId,{headers})).json();assert.equal(job.job.status,'SUCCEEDED');assert.equal(job.job.model.url,model.url);const list=await(await fetch(root+'/api/models',{headers})).json();assert.ok(list.jobs.find(j=>j.id===model.jobId));
const bad=new FormData();bad.append('itemId','qa');bad.append('file',new Blob(['not a GLB']),'bad.glb');assert.equal((await fetch(root+'/api/models/import',{method:'POST',headers,body:bad})).status,400);
const raw=JSON.stringify({asset:{version:'2.0'},buffers:[{uri:'https://example.org/private.bin',byteLength:1}]});const text=new TextEncoder().encode(raw.padEnd(Math.ceil(raw.length/4)*4,' '));const ext=new ArrayBuffer(text.length+20),dv=new DataView(ext);dv.setUint32(0,0x46546c67,true);dv.setUint32(4,2,true);dv.setUint32(8,ext.byteLength,true);dv.setUint32(12,text.length,true);dv.setUint32(16,0x4e4f534a,true);new Uint8Array(ext,20).set(text);assert.throws(()=>validateGlb(ext),/외부/);
await fs.writeFile('../qa-model-result.json',JSON.stringify({model}));
console.log('PASS: GLB structure, invalid/external files rejected, R2 upload/read, unauthenticated access denied, model history, paid generation disabled. No paid generation requested.');
