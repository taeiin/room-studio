export const MAX_GLB=40*1024*1024;
export function validateGlb(buffer:ArrayBuffer){
 if(buffer.byteLength<20||buffer.byteLength>MAX_GLB)throw Error('40MB 이하 GLB 파일만 지원합니다.');
 const d=new DataView(buffer);if(d.getUint32(0,true)!==0x46546c67||d.getUint32(4,true)!==2||d.getUint32(8,true)!==buffer.byteLength)throw Error('유효한 glTF 2.0 GLB 파일이 아닙니다.');
 const jsonSize=d.getUint32(12,true);if(jsonSize>buffer.byteLength-20||d.getUint32(16,true)!==0x4e4f534a)throw Error('GLB 메타데이터를 읽을 수 없습니다.');
 const j=JSON.parse(new TextDecoder().decode(new Uint8Array(buffer,20,jsonSize)));for(const r of [...(j.buffers||[]),...(j.images||[])]){if(r.uri&&!/^data:(image\/(png|jpeg|webp)|application\/octet-stream);base64,/i.test(r.uri))throw Error('텍스처와 메시가 파일에 포함된 단일 GLB로 내보내주세요. 외부 파일을 참조하는 모델은 지원하지 않습니다.');}return j;
}
