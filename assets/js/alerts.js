const LV={crit:'Критично',warn:'Внимание',info:'Инфо'};
function checkAlerts(){
  const c=S.settings;
  ZONES.forEach(z=>{
    const d=S.zones[z.id],on=d.online;
    [['off','crit',!on,'Датчики зоны не отвечают'],
     ['hot','crit',on&&d.temp>c.tempMax+5,`Перегрев: ${f(d.temp)} °C`],
     ['dry','warn',on&&d.soil<c.soilMin-15,`Почва слишком сухая: ${f(d.soil,0)} %`],
     ['hum','warn',on&&d.hum>c.humMax+5,`Высокая влажность воздуха: ${f(d.hum,0)} %`],
     ['co2','warn',on&&d.co2>1200,`Высокий CO₂: ${f(d.co2,0)} ppm`]
    ].forEach(([key,lv,cond,msg])=>{
      const a=S.alerts.find(x=>x.zone===z.id&&x.key===key&&!x.res);
      if(cond&&!a)S.alerts.unshift({id:'a'+Date.now()+key+z.id,t:Date.now(),zone:z.id,key,lv,msg,ack:false,res:false});
      else if(!cond&&a)a.res=true;
    });
  });
  if(S.alerts.length>100)S.alerts.length=100;
}
const ack=id=>{const a=S.alerts.find(x=>x.id===id);if(a)a.ack=true;render()};
const ackAll=()=>{S.alerts.forEach(a=>a.ack=true);render()};
const clearRes=()=>{S.alerts=S.alerts.filter(a=>!a.res);render()};
R.alerts=()=>`<h1>Тревоги и события</h1>
<p><button class="btn" onclick="ackAll()">Принять все</button> <button class="btn ghost" onclick="clearRes()">Очистить устранённые</button></p>
<div class="card">${S.alerts.length?S.alerts.map(a=>`<div class="row"><span class="tag ${a.lv==='crit'?'bad':'warn'}">${LV[a.lv]}</span><span><b>${ZONES[a.zone-1].name}:</b> ${a.msg}<br><small>${new Date(a.t).toLocaleTimeString()} · ${a.res?'устранено':a.ack?'принято':'активно'}</small></span>${!a.ack&&!a.res?`<button class="btn sm" onclick="ack('${a.id}')">Принять</button>`:''}</div>`).join(''):'<p>Тревог нет. Чтобы проверить, отключите датчики на странице «Датчики».</p>'}</div>
<h2>Журнал автоматики</h2><div class="card">${S.log.slice(0,10).map(e=>`<div class="row"><small>${new Date(e.t).toLocaleTimeString()}</small><span>${e.m}</span></div>`).join('')||'<p>Действий пока не было.</p>'}</div>`;
