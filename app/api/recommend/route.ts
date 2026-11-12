import {recommendForRoom} from '../../../lib/room-design';
export async function POST(req:Request){try{const {items,style,budget,roomId}=await req.json() as {items:import("../../../lib/design").Item[];style:string;budget:number;roomId?:string};if(!Array.isArray(items)||items.length>100||items.some(i=>!i||typeof i.id!=='string'||![i.w,i.d,i.h,i.price].every(Number.isFinite)||Math.min(i.w,i.d,i.h)<=0))throw Error();return Response.json({plans:recommendForRoom(items,style,Math.max(0,Number(budget)||0),roomId||"bedroom1")});}catch{return Response.json({error:'가구 정보와 치수를 확인해주세요.'},{status:400});}}


