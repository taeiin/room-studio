export const rooms=[
 {id:'bedroom1',name:'안방',label:'침실 1',w:3.6,d:4.2,area:'15.4920',desc:'양쪽 발코니가 있는 안방',verified:true,rect:[276,316,213,244]},
 {id:'bedroom2',name:'침실 2',label:'침실 2',w:3.3,d:3,area:'10.6704',desc:'입구 쪽 침실',verified:true,rect:[895,132,190,173]},
 {id:'bedroom3',name:'침실 3',label:'침실 3',w:2.7,d:2.7,area:'7.9524',desc:'안방 옆 작은 침실',verified:false,rect:[461,145,155,160]},
 {id:'living',name:'거실',label:'발코니 확장 거실',w:4.5,d:5.9,area:'29.5571',desc:'위쪽 발코니를 포함한 확장 거실',verified:false,rect:[626,40,260,340]},
 {id:'kitchen',name:'주방·식당',label:'주방·식당',w:3.6,d:3.1,area:'11.1342',desc:'거실과 이어지는 주방',verified:false,rect:[638,380,218,180]},
 {id:'dress',name:'드레스룸',label:'드레스룸',w:2.2,d:1.33,area:'3.2385',desc:'안방에 연결되는 수납 공간',verified:false,rect:[495,382,130,78]},
 {id:'bath1',name:'공용 욕실',label:'욕실 1',w:2.12,d:1.57,area:'3.6465',desc:'현관 옆 욕실',verified:false,rect:[954,315,130,90]},
 {id:'bath2',name:'안방 욕실',label:'욕실 2',w:2.2,d:1.27,area:'3.2832',desc:'안방의 전용 욕실',verified:false,rect:[495,460,130,100]},
 {id:'entry',name:'현관·전실',label:'현관',w:1.7,d:3,area:'8.1446',desc:'집의 첫인상을 만드는 공간',verified:false,rect:[865,415,88,220]}
];
export type RoomInfo=typeof rooms[number];
