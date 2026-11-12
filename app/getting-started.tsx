'use client';
import {useState} from 'react';

const prompt=`이 가구의 상품 링크 또는 첨부 사진을 참고해 Room Studio에서 사용할 GLB 3D 모델을 만들어줘.
- 상품 링크: 여기에 붙여넣기
- 가로 × 깊이 × 높이: 확인한 치수를 mm로 입력
- 원하는 색상과 소재: 입력
사진에서 보이는 형태를 최대한 반영하고, 확인할 수 없는 부분은 추정이라고 알려줘. 완성된 GLB 파일의 저장 위치도 알려줘.`;
const deployPrompt=`이 저장소를 내 GitHub 계정과 Cloudflare 계정으로 독립 배포할 수 있게 도와줘. 먼저 README.md, AGENTS.md와 docs/배포-가이드.md를 읽어줘.
1. 현재 코드의 빌드·배포 설정과 Sites 전용 인증 및 저장소 의존성을 확인하고, 공개 서비스에서 안전한 구조로 수정해줘. 기존 Sites의 project_id를 재사용하지 마.
2. 무료로 시작할 수 있는 사용 한도와 제한을 먼저 설명하고, 비용이 발생하는 선택은 내가 결정할 수 있게 해줘.
3. 내 GitHub 저장소와 Cloudflare Workers를 연결할 수 있도록 필요한 설정과 명령을 준비하고 로컬 빌드를 검증해줘.
4. 내가 로그인과 계정 연결을 직접 할 수 있도록 화면 순서대로 안내해줘. 비밀번호나 API 키를 채팅 또는 Git에 적게 하지 마.
5. 배포 후 공개 주소에서 도면 업로드, 방 지정, GLB 가구 등록·배치와 백업을 검증해줘. 사용자별 서버 저장이 없으면 기기별 저장임을 알려줘.`;
export default function GettingStarted({hasPlan,hasRooms,hasScale,hasFurniture}:{hasPlan:boolean;hasRooms:boolean;hasScale:boolean;hasFurniture:boolean}){
 const [open,setOpen]=useState(false),[copied,setCopied]=useState(false),[deployCopied,setDeployCopied]=useState(false);const current=!hasPlan?0:!hasRooms?1:!hasScale?2:!hasFurniture?3:4;
 const steps=[{title:'도면 준비',detail:'도면 이미지를 올리거나 예시로 먼저 둘러보세요.'},{title:'방 만들기',detail:'방 후보를 확인하고 실제 방만 추가하거나 직접 지정하세요.'},{title:'크기 맞추기',detail:'방 하나의 실제 가로 치수를 입력한 뒤 3D로 확인하세요.'},{title:'가구 놓기',detail:'Codex에서 만든 GLB 파일을 보관함에 등록하고 방에 놓으세요.'}];
 async function copy(text:string,kind:"furniture"|"deploy"){try{await navigator.clipboard.writeText(text);const setter=kind==="furniture"?setCopied:setDeployCopied;setter(true);setTimeout(()=>setter(false),3000)}catch{}}
 return <section className="getting-started" aria-label="사용 안내"><div className="guide-summary"><div className="guide-summary-copy"><span className="guide-icon" aria-hidden="true">✳</span><div><strong>{current<4?`다음 단계 · ${steps[current].title}`:'우리 집을 꾸밀 준비가 됐어요'}</strong><p>{current<4?steps[current].detail:'도면과 가구를 배치하고 백업 파일로 보관해 보세요.'}</p></div></div><button className="guide-toggle" aria-expanded={open} aria-controls="guide-details" onClick={()=>setOpen(!open)}>{open?'안내 닫기':'사용 방법'} <span aria-hidden="true">{open?'−':'＋'}</span></button></div>{open&&<div id="guide-details" className="guide-details"><ol className="guide-steps">{steps.map((s,i)=><li key={s.title} className={i===current?'current':''}><span>{i<current?'✓':String(i+1).padStart(2,'0')}</span><div><strong>{s.title}</strong><p>{s.detail}</p></div></li>)}</ol><div className="guide-extra"><div><h3>Codex로 가구 만들기</h3><p>상품 링크나 사진, 치수와 색상을 Codex 앱에 전달해 GLB 파일을 만든 뒤 이 웹에 직접 올려주세요. 웹에서 Codex가 자동 실행되지는 않아요.</p><details><summary>Codex에 보낼 요청 예시</summary><p className="guide-prompt">{prompt}</p><button onClick={()=>copy(prompt,"furniture")}>{copied?'복사했어요':'요청 문구 복사'}</button></details></div><div><h3>다른 PC에서 이어하기</h3><p>‘백업 내려받기’로 도면과 가구를 파일로 저장한 뒤 다른 PC에서 ‘백업 불러오기’를 눌러주세요. 자동 동기화는 아직 지원하지 않아요.</p></div></div><section className="deploy-guide"><h3>내 웹사이트로 배포하기</h3><p>GitHub에서 코드를 받는 것과 웹사이트를 공개하는 것은 별도 단계예요. 이 프로젝트에는 아직 자동 배포 설정이 없습니다.</p><ol><li><b>① 내 저장소 준비</b><span>GitHub에서 이 프로젝트를 포크하고 내 PC에 복제해요.</span></li><li><b>② Codex로 배포 준비</b><span>복제한 폴더를 Codex 앱에서 열고 아래 요청을 전달해요. Codex가 설정과 보안을 먼저 점검해요.</span></li><li><b>③ 호스팅 연결</b><span>Cloudflare 등 선택한 호스팅에 로그인하고 내 GitHub 저장소를 연결해요.</span></li><li><b>④ 공개 주소 확인</b><span>배포 후 새 주소에서 도면·가구·백업 기능을 시험해요. 이후 GitHub에 올린 변경은 설정에 따라 자동 반영돼요.</span></li></ol><details><summary>Codex에 보낼 배포 요청</summary><p className="guide-prompt">{deployPrompt}</p><button onClick={()=>copy(deployPrompt,"deploy")}>{deployCopied?'복사했어요':'배포 요청 복사'}</button></details><p className="deploy-note">현재 프로젝트는 배포 전 설정과 보안 보완이 필요해요. 무료 요금제의 한도·비용은 선택 전에 확인해 주세요. 자동 동기화와 사용자별 서버 저장은 아직 없습니다.</p></section><p className="guide-footnote">방 후보 감지는 실험 기능이에요. 문·창문과 치수는 직접 확인하고, 3D는 참고용으로 살펴봐 주세요.</p></div>}</section>
}
