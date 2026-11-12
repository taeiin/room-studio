'use client';
import {useState} from 'react';

export default function Page(){
 const [image,setImage]=useState<string|null>(null);
 function selectPlan(e:React.ChangeEvent<HTMLInputElement>){const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>setImage(String(reader.result));reader.readAsDataURL(file)}
 return <main style={{fontFamily:'system-ui, sans-serif',maxWidth:900,margin:'0 auto',padding:'60px 24px',color:'#313b30'}}><p style={{letterSpacing:4,fontSize:12}}>ROOM STUDIO</p><h1>새로운 공간을 시작하세요</h1><p>집 도면을 준비하고, 원하는 가구로 공간을 채워보세요.</p><section style={{marginTop:40,border:'1px solid #dce2d7',borderRadius:12,padding:28,background:'#fafbf8'}}><h2>우리 집 도면</h2><p>처음에는 도면과 가구가 없는 새 프로젝트입니다.</p><label style={{display:'inline-block',background:'#53654a',color:'white',padding:'12px 18px',borderRadius:6,cursor:'pointer'}}>도면 이미지 선택<input type="file" accept="image/png,image/jpeg,image/webp" onChange={selectPlan} style={{display:'none'}}/></label>{image&&<div><img src={image} alt="선택한 집 도면 미리보기" style={{maxWidth:'100%',maxHeight:480,marginTop:24}}/></div>}<p style={{marginTop:20}}>도면 자동 인식과 3D 공간 생성은 개발 준비 중입니다. 선택한 이미지는 이 화면의 임시 미리보기이며 저장되지 않습니다.</p></section><section style={{marginTop:24,border:'1px solid #dce2d7',borderRadius:12,padding:28}}><h2>가구 보관함</h2><p>아직 추가된 가구가 없습니다. Codex 앱으로 제작한 3D 가구를 등록하는 기능을 준비하고 있습니다.</p></section></main>;
}
