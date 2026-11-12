'use client';
import {useState} from 'react';

const prompt=`이 가구의 상품 링크 또는 첨부 사진을 참고해 Room Studio에서 사용할 GLB 3D 모델을 만들어줘.
- 상품 링크: 여기에 붙여넣기
- 가로 × 깊이 × 높이: 확인한 치수를 mm로 입력
- 원하는 색상과 소재: 입력
사진에서 보이는 형태를 최대한 반영하고, 확인할 수 없는 부분은 추정이라고 알려줘. 완성된 GLB 파일의 저장 위치도 알려줘.`;
export default function GettingStarted({hasPlan,hasRooms,hasScale,hasFurniture}:{hasPlan:boolean;hasRooms:boolean;hasScale:boolean;hasFurniture:boolean}){
 const [open,setOpen]=useState(false),[copied,setCopied]=useState(false);const current=!hasPlan?0:!hasRooms?1:!hasScale?2:!hasFurniture?3:4;
 const steps=[{title:'도면 준비',detail:'도면 이미지를 올리거나 예시로 먼저 둘러보세요.'},{title:'방 만들기',detail:'방 후보를 확인하고 실제 방만 추가하거나 직접 지정하세요.'},{title:'크기 맞추기',detail:'방 하나의 실제 가로 치수를 입력한 뒤 3D로 확인하세요.'},{title:'가구 놓기',detail:'Codex에서 만든 GLB 파일을 보관함에 등록하고 방에 놓으세요.'}];
 async function copy(){try{await navigator.clipboard.writeText(prompt);setCopied(true);setTimeout(()=>setCopied(false),3000)}catch{setCopied(false)}}
 return <section className="getting-started" aria-label="사용 안내"><div className="guide-summary"><div className="guide-summary-copy"><span className="guide-icon" aria-hidden="true">✳</span><div><strong>{current<4?`다음 단계 · ${steps[current].title}`:'우리 집을 꾸밀 준비가 됐어요'}</strong><p>{current<4?steps[current].detail:'도면과 가구를 배치하고 백업 파일로 보관해 보세요.'}</p></div></div><button className="guide-toggle" aria-expanded={open} aria-controls="guide-details" onClick={()=>setOpen(!open)}>{open?'안내 닫기':'사용 방법'} <span aria-hidden="true">{open?'−':'＋'}</span></button></div>{open&&<div id="guide-details" className="guide-details"><ol className="guide-steps">{steps.map((s,i)=><li key={s.title} className={i===current?'current':''}><span>{i<current?'✓':String(i+1).padStart(2,'0')}</span><div><strong>{s.title}</strong><p>{s.detail}</p></div></li>)}</ol><div className="guide-extra"><div><h3>Codex로 가구 만들기</h3><p>상품 링크나 사진, 치수와 색상을 Codex 앱에 전달해 GLB 파일을 만든 뒤 이 웹에 직접 올려주세요. 웹에서 Codex가 자동 실행되지는 않아요.</p><details><summary>Codex에 보낼 요청 예시</summary><p className="guide-prompt">{prompt}</p><button onClick={copy}>{copied?'복사했어요':'요청 문구 복사'}</button></details></div><div><h3>다른 PC에서 이어하기</h3><p>‘백업 내려받기’로 도면과 가구를 파일로 저장한 뒤 다른 PC에서 ‘백업 불러오기’를 눌러주세요. 자동 동기화는 아직 지원하지 않아요.</p></div></div><p className="guide-footnote">방 후보 감지는 실험 기능이에요. 문·창문과 치수는 직접 확인하고, 3D는 참고용으로 살펴봐 주세요.</p></div>}</section>
}
