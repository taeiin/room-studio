'use client';
import {useEffect,useState,type ComponentType} from 'react';
import type {RoomProps} from './room-webgl';
// WebGL loaders use browser module URLs. Load only after mounting, never in Worker SSR.
export default function RoomClient(props:RoomProps){
 const [View,setView]=useState<ComponentType<RoomProps>|null>(null);
 useEffect(()=>{let alive=true;import('./room-webgl').then(m=>{if(alive)setView(()=>m.default)});return()=>{alive=false}},[]);
 return View?<View {...props}/>:<div className="webgl-room" role="status">3D 공간을 준비하는 중…</div>;
}
