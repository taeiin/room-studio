export type FurnitureModel={url:string;source:'photo'|'meshy'|'import';yaw:number;jobId:string;createdAt:string};
export type Item={id:string;name:string;kind:string;w:number;d:number;h:number;color:string;material:string;price:number;image?:string;url?:string;sample?:boolean;note?:string;variants?:{label:string;url:string;price?:number;image?:string;color?:string;material?:string}[];model?:FurnitureModel};
export type Placed={id:string;itemId?:string;x:number;y:number;rot:number};
export const kinds:Record<string,string>={bed:'침대',sofa:'소파',dining:'식탁',table:'협탁',dresser:'서랍장',chair:'체어',rug:'러그',lamp:'조명',desk:'책상',wardrobe:'옷장'};
export const samples:Item[]=[];
export const styles=[{id:'warm',label:'따뜻한 내추럴',en:'Warm natural',desc:'우드의 온기와 여유로운 여백'},{id:'calm',label:'차분한 미니멀',en:'Quiet minimal',desc:'낮은 시선, 절제된 색의 연결'},{id:'hotel',label:'호텔식 대칭',en:'Soft symmetry',desc:'침대를 중심으로 정돈된 균형'}];
export function recommend(items:Item[],style:string,budget:number){
 const rgb=(c:string)=>[1,3,5].map(n=>parseInt(c.slice(n,n+2),16));
 const target=rgb(style==='calm'?'#d6cbbb':style==='hotel'?'#a18d79':'#b89772');
 const score=(i:Item)=>{const c=rgb(i.color);const tone=1-Math.sqrt(c.reduce((s,v,n)=>s+(v-target[n])**2,0))/442;return tone*3+(style==='calm'?(i.material==='패브릭'?2:0):i.material==='오크'?2:0)-(i.price/(budget||10000000))+(i.kind==='bed'?-Math.abs(i.w-1600)/500:0)};
 const choose=(kind:string)=>items.filter(i=>i.kind===kind).sort((a,b)=>score(b)-score(a))[0];
 const firstBed=choose('bed'); if(!firstBed)return [];
 return [0,1,2].map(n=>{const bed=n===1?(items.filter(i=>i.kind==='bed'&&i.id!==firstBed.id).sort((a,b)=>score(b)-score(a))[0]||firstBed):firstBed;let placed:Placed[]=[];let chosen:Item[]=[];let total=0;const add=(i:Item|undefined,x:number,y:number,rot=0,essential=false)=>{if(!i||(!essential&&budget>0&&total+i.price>budget))return;const duplicate=chosen.some(q=>q.id===i.id);chosen.push(i);total+=i.price;placed.push({id:duplicate?i.id+'-pair':i.id,itemId:i.id,x,y,rot})};
 const bw=bed.w/1000,bd=bed.d/1000; const by=n===1&&style!=='hotel'?1.35:2.1;add(bed,0.12+bd/2,by,270,true);
 const rug=choose('rug');if(rug)add(rug,1.65,2.1,90);
 const table=choose('table'); if(table){add(table,0.55,Math.min(3.85,by+bw/2+table.d/2000+0.08));}
 if(style==='hotel'&&table)add(table,0.55,Math.max(.3,by-bw/2-table.d/2000-.08));
 const dresser=choose('dresser');if(dresser)add(dresser,3.28,n===2?2.1:1.8,90);
 const chair=choose('chair');if(n!==2&&chair)add(chair,2.85,3.45,0);
 const lamp=choose('lamp');if(lamp)add(lamp,2.2,3.7);
 const desk=choose('desk');if(n===2&&desk)add(desk,2.8,0.6);
 const wardrobe=choose('wardrobe');if(n===2&&wardrobe&&!desk)add(wardrobe,3.1,0.8,90);
 const names=['중심을 잡은 침실',style==='hotel'?'소재를 바꾼 침실':'한쪽에 여백을 둔 침실','정돈된 휴식 공간'];
 const notes=[['침대를 주인공으로','헤드보드를 양쪽 발코니 사이의 왼쪽 벽에 두고 중심을 잡았습니다. 침구와 협탁의 명도를 연결해 시선을 정돈합니다.'],['비대칭의 편안함','침대를 한쪽으로 이동해 반대편에 넉넉한 여백을 만듭니다. 의자와 조명을 작은 장면처럼 묶어보세요.'],['낮은 가구의 리듬','발치 쪽 가구를 낮게 정리하고 양쪽 발코니를 향한 시선을 열어 공간을 단정하게 만듭니다.']][n];
 if(n===1&&style==='hotel'){notes[0]='소재로 만드는 차이';notes[1]='중심 배치는 유지하고 침대 소재를 비교합니다. 패브릭은 부드러움을, 원목은 선명한 윤곽과 온기를 더합니다.';} const materials=[...new Set(chosen.filter(i=>['bed','table','dresser'].includes(i.kind)).map(i=>i.material))];
 return {id:n,title:names[n],placed,ids:chosen.map(i=>i.id),total,overBudget:budget>0&&total>budget,notes:[{title:notes[0],body:notes[1]},{title:'소재를 잇는 방법',body:materials.length<=2?`${materials.join(' · ')} 중심으로 큰 가구의 소재를 연결했습니다. 침구는 무채색으로 두고 작은 소품에만 색을 더해보세요.`:`${materials.join(' · ')}이 함께 쓰입니다. 우드 색이 여러 개라면 침구와 러그를 같은 저채도 색으로 맞춰 연결하세요.`},{title:'비례와 색의 균형',body:`폭 ${(bed.w/1000).toFixed(2)}m 침대가 4.2m 벽의 ${Math.round(bed.w/4200*100)}%를 차지합니다. ${style==='hotel'?'침구와 벽등을 좌우로 맞추면 호텔처럼 안정적인 인상이 납니다.':style==='calm'?'침구와 벽을 비슷한 명도로 맞추고 장식은 한두 개만 남겨보세요.':'밝은 벽과 따뜻한 우드에 올리브나 베이지를 소량 더하면 부드러운 깊이가 생깁니다.'}`}],alternative:items.filter(i=>i.kind==='bed'&&i.id!==bed.id).map(i=>({name:i.name,reason:i.material!==bed.material?'다른 소재의 헤드보드로 분위기를 바꿀 수 있는 대안입니다.':'비슷한 소재지만 폭과 가격을 비교해 선택할 수 있습니다.'}))}; });
}



