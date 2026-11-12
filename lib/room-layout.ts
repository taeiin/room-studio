import type {Placed} from './design';
export const layoutVersion=1;
// Derived from the existing schematic balcony/room proportions; verify against site measurements.
export const livingExtensionDepth=1.5;
export function restoreRoomLayout(p:any){
 if(p.layoutVersion>=layoutVersion)return p;
 const shift=(placed:Placed[])=>(placed||[]).map(q=>({...q,y:q.y+livingExtensionDepth}));
 const rooms={...p.rooms};
 if(rooms.living)rooms.living={...rooms.living,placed:shift(rooms.living.placed)};
 return {...p,layoutVersion,rooms,placed:p.roomId==='living'?shift(p.placed):p.placed};
}
