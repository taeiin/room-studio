import * as T from 'three';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {foregroundMask,type BackgroundMode} from './photo-mask';
export async function createPhotoModel(src:string,dims:{w:number;d:number;h:number},mode:BackgroundMode,tolerance:number,onProgress:(n:number)=>void){
 const img=await new Promise<HTMLImageElement>((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('사진을 불러오지 못했습니다.'));i.src=src});onProgress(15);
 const grid=document.createElement('canvas');const ratio=Math.min(1,144/Math.max(img.width,img.height));grid.width=Math.max(2,Math.round(img.width*ratio));grid.height=Math.max(2,Math.round(img.height*ratio));const ctx=grid.getContext('2d',{willReadFrequently:true})!;ctx.drawImage(img,0,0,grid.width,grid.height);const image=ctx.getImageData(0,0,grid.width,grid.height),{mask,bounds,total}=foregroundMask(image.data,grid.width,grid.height,mode,tolerance);onProgress(35);await new Promise(r=>setTimeout(r,0));
 const {minX,minY,maxX,maxY}=bounds;const W=(maxX-minX+1),H=(maxY-minY+1),width=dims.w/1000,height=dims.h/1000,depth=dims.d/1000;const positions:number[]=[],uvs:number[]=[];
 const face=(pts:number[][],uv:number[][])=>{for(const n of [0,1,2,0,2,3]){positions.push(...pts[n]);uvs.push(...uv[n])}};
 const present=(x:number,y:number)=>x>=0&&y>=0&&x<grid.width&&y<grid.height&&mask[y*grid.width+x]===1;
 for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){if(!present(x,y))continue;const l=(x-minX)/W*width-width/2,r=(x-minX+1)/W*width-width/2,t=height-(y-minY)/H*height,b=height-(y-minY+1)/H*height,z=depth/2;const u0=x/grid.width,u1=(x+1)/grid.width,v0=1-(y+1)/grid.height,v1=1-y/grid.height;const uv=[[u0,v0],[u1,v0],[u1,v1],[u0,v1]];
 face([[l,b,z],[r,b,z],[r,t,z],[l,t,z]],uv);face([[r,b,-z],[l,b,-z],[l,t,-z],[r,t,-z]],[[u1,v0],[u0,v0],[u0,v1],[u1,v1]]);
 const c=[[(u0+u1)/2,(v0+v1)/2],[(u0+u1)/2,(v0+v1)/2],[(u0+u1)/2,(v0+v1)/2],[(u0+u1)/2,(v0+v1)/2]];
 if(!present(x-1,y))face([[l,b,-z],[l,b,z],[l,t,z],[l,t,-z]],c);if(!present(x+1,y))face([[r,b,z],[r,b,-z],[r,t,-z],[r,t,z]],c);if(!present(x,y-1))face([[l,t,z],[r,t,z],[r,t,-z],[l,t,-z]],c);if(!present(x,y+1))face([[l,b,-z],[r,b,-z],[r,b,z],[l,b,z]],c);
 }
 const textureCanvas=document.createElement('canvas');const s=Math.min(1,1536/Math.max(img.width,img.height));textureCanvas.width=Math.round(img.width*s);textureCanvas.height=Math.round(img.height*s);textureCanvas.getContext('2d')!.drawImage(img,0,0,textureCanvas.width,textureCanvas.height);const texture=new T.CanvasTexture(textureCanvas);texture.colorSpace=T.SRGBColorSpace;const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));geo.computeVertexNormals();const mat=new T.MeshStandardMaterial({map:texture,roughness:.9,metalness:0});const mesh=new T.Mesh(geo,mat);mesh.name='Photo silhouette volume';onProgress(65);await new Promise(r=>setTimeout(r,0));
 try{const glb=await new GLTFExporter().parseAsync(mesh,{binary:true,onlyVisible:true,maxTextureSize:1536});if(!(glb instanceof ArrayBuffer))throw Error('모델 파일을 만들지 못했습니다.');onProgress(100);return {file:new File([glb],'furniture-photo.glb',{type:'model/gltf-binary'}),maskPreview:grid.toDataURL(),cells:total,triangles:positions.length/9};}finally{geo.dispose();mat.dispose();texture.dispose()}
}
