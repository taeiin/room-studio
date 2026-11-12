export type BackgroundMode='auto'|'light'|'dark'|'keep';
// Border-connected color removal keeps similarly colored areas inside the object.
export function foregroundMask(rgba:Uint8ClampedArray,w:number,h:number,mode:BackgroundMode,tolerance:number){
 const count=w*h,mask=new Uint8Array(count),background=new Uint8Array(count),queue=new Int32Array(count);let head=0,tail=0;const samples:number[][]=[];
 const sample=(x:number,y:number)=>{const k=(y*w+x)*4;if(rgba[k+3]>100)samples.push([rgba[k],rgba[k+1],rgba[k+2]])};
 if(mode==='auto'){for(let n=0;n<8;n++){sample(Math.round(n*(w-1)/7),0);sample(Math.round(n*(w-1)/7),h-1);sample(0,Math.round(n*(h-1)/7));sample(w-1,Math.round(n*(h-1)/7));}}else if(mode==='light')samples.push([255,255,255]);else if(mode==='dark')samples.push([0,0,0]);
 const near=(i:number)=>{const k=i*4;if(rgba[k+3]<50)return true;if(mode==='keep')return false;return samples.some(c=>(rgba[k]-c[0])**2+(rgba[k+1]-c[1])**2+(rgba[k+2]-c[2])**2<tolerance*tolerance*3)};
 const push=(i:number)=>{if(!background[i]&&near(i)){background[i]=1;queue[tail++]=i}};
 for(let x=0;x<w;x++){push(x);push((h-1)*w+x)}for(let y=0;y<h;y++){push(y*w);push(y*w+w-1)}
 while(head<tail){const i=queue[head++],x=i%w,y=Math.floor(i/w);if(x>0)push(i-1);if(x<w-1)push(i+1);if(y>0)push(i-w);if(y<h-1)push(i+w)}
 for(let i=0;i<count;i++)mask[i]=!background[i]&&rgba[i*4+3]>=50?1:0;
 let minX=w,minY=h,maxX=-1,maxY=-1,total=0;for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(mask[y*w+x]){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);total++}
 if(total<Math.max(12,count*.003))throw Error('가구 윤곽을 찾지 못했습니다. 제거 강도를 낮추거나 배경 유지로 바꿔주세요.');return {mask,bounds:{minX,minY,maxX,maxY},total};
}
