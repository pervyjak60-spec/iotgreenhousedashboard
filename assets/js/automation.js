const ACT={pump:'полив',vent:'вентиляция',lamp:'свет'};
function setAct(id,k,v,src){
  const d=S.zones[id];if(d[k]===v)return;d[k]=v;
  S.log.unshift({t:Date.now(),m:`${ZONES[id-1].name}: ${ACT[k]} ${v?'включён':'выключен'} (${src})`});
  S.log.length=Math.min(S.log.length,30);
}
function automation(){
  const c=S.settings;if(!c.auto)return;
  const hr=new Date().getHours(),night=hr<6||hr>=21;
  ZONES.forEach(z=>{
    const d=S.zones[z.id];if(!d.online||d.mode!=='auto')return;
    if(d.soil<c.soilMin)setAct(z.id,'pump',true,'авто');else if(d.soil>c.soilMax)setAct(z.id,'pump',false,'авто');
    if(d.temp>c.tempMax||d.hum>c.humMax)setAct(z.id,'vent',true,'авто');
    else if(d.temp<c.tempMax-2&&d.hum<c.humMax-5)setAct(z.id,'vent',false,'авто');
    if(night||d.light>c.lightMin+5)setAct(z.id,'lamp',false,'авто');
    else if(d.light<c.lightMin)setAct(z.id,'lamp',true,'авто');
  });
}
function setMode(id){const d=S.zones[id];d.mode=d.mode==='auto'?'manual':'auto';render()}
function stopAll(){
  ZONES.forEach(z=>{Object.keys(ACT).forEach(k=>setAct(z.id,k,false,'аварийная остановка'));S.zones[z.id].mode='manual'});
  render();
}
function toggleOnline(id){S.zones[id].online=!S.zones[id].online;render()}
