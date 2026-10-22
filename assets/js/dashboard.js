const PAGES=[['index','Главная'],['dashboard','Дашборд'],['zones','Зоны'],['sensors','Датчики'],['control','Управление'],['alerts','Тревоги'],['analytics','Аналитика'],['settings','Настройки']];
const page=document.body.dataset.page;
const ST={ok:'Норма',warn:'Внимание',bad:'Авария'};
function zst(d){const c=S.settings;
  if(!d.online||d.temp>c.tempMax+5||d.soil<c.soilMin-15)return'bad';
  if(d.temp>c.tempMax||d.soil<c.soilMin||d.hum>c.humMax)return'warn';return'ok';}
const chip=(n,on)=>`<span class="chip ${on?'on':''}">${n}</span>`;
const bar=(n,v,max)=>`<div class="bar"><small>${n}: ${f(v,0)}</small><i><b style="width:${clamp(v/max*100,0,100)}%"></b></i></div>`;
function zoneCard(z,full){
  const d=S.zones[z.id],s=zst(d);
  return `<div class="card"><h3>${z.icon} ${z.name} <span class="tag ${s}">${ST[s]}</span></h3>
  ${d.online?`<p>🌡️ ${f(d.temp)} °C · 💧 ${f(d.hum,0)} % · 🌱 ${f(d.soil,0)} % · ☀️ ${f(d.light)} клк</p>`:'<p>Нет связи с датчиками</p>'}
  <p class="acts">${chip('Полив',d.pump)}${chip('Вентиляция',d.vent)}${chip('Свет',d.lamp)}</p>
  ${full?`${bar('Почва, %',d.soil,100)}${bar('Воздух, %',d.hum,100)}${bar('Температура, °C',d.temp,45)}<p><small>Режим: ${d.mode==='auto'?'автоматический':'ручной'} · Вода: ${f(d.water,1)} л</small></p>`:''}</div>`;
}
R.index=()=>`<section class="hero"><h1>IoT Smart Greenhouse</h1><p>Платформа управления теплицей: мониторинг датчиков, автоматический полив, вентиляция и освещение, тревоги и аналитика с рекомендациями. Данные моделирует встроенный симулятор.</p><a class="btn" href="dashboard.html">Открыть дашборд</a></section>
<div class="grid">${[['📡','Датчики','sensors','Состояние и связь'],['⚙️','Управление','control','Авто и ручной режим'],['🚨','Тревоги','alerts','События и журнал'],['📈','Аналитика','analytics','Графики и советы']].map(([i,n,h,t])=>`<a class="card kpi" href="${h}.html"><span>${i}</span><b>${n}</b><small>${t}</small></a>`).join('')}</div>`;
R.dashboard=()=>{
  const on=ZONES.filter(z=>S.zones[z.id].online),avg=k=>on.length?on.reduce((a,z)=>a+S.zones[z.id][k],0)/on.length:0;
  return `<h1>Дашборд</h1><div class="grid">${[['🌡️','Температура',f(avg('temp'))+' °C'],['💧','Влажность воздуха',f(avg('hum'),0)+' %'],['🌱','Влажность почвы',f(avg('soil'),0)+' %'],['🚨','Активные тревоги',S.alerts.filter(a=>!a.res).length]].map(([i,n,v])=>`<div class="card kpi"><span>${i}</span><small>${n}</small><b>${v}</b></div>`).join('')}</div><h2>Зоны</h2><div class="grid">${ZONES.map(z=>zoneCard(z)).join('')}</div>`;
};
R.zones=()=>`<h1>Зоны теплицы</h1><div class="grid">${ZONES.map(z=>zoneCard(z,1)).join('')}</div>`;
R.sensors=()=>`<h1>Датчики</h1><div class="card scroll"><table><tr><th>Зона</th>${SENSORS.map(s=>`<th>${s.n}</th>`).join('')}<th>Связь</th></tr>${ZONES.map(z=>{const d=S.zones[z.id];return `<tr><td>${z.icon} ${z.name}</td>${SENSORS.map(s=>`<td>${d.online?f(d[s.k],s.k==='co2'?0:1)+' '+s.u:'—'}</td>`).join('')}<td><button class="btn sm ${d.online?'':'ghost'}" onclick="toggleOnline(${z.id})">${d.online?'Онлайн':'Офлайн'}</button></td></tr>`}).join('')}</table><p><small>Нажмите на статус связи, чтобы имитировать отказ датчиков.</small></p></div>`;
R.control=()=>`<h1>Управление</h1><div class="card"><label><input type="checkbox" ${S.settings.auto?'checked':''} onchange="S.settings.auto=this.checked;render()"> Автоматика включена</label> <button class="btn danger" onclick="stopAll()">Аварийная остановка</button></div>
<div class="grid">${ZONES.map(z=>{const d=S.zones[z.id],can=d.mode==='manual'||!S.settings.auto;return `<div class="card"><h3>${z.icon} ${z.name}</h3><p>Режим: <button class="btn sm" onclick="setMode(${z.id})">${d.mode==='auto'?'Авто':'Ручной'}</button></p><p class="acts">${[['pump','💧 Полив'],['vent','🌬️ Вентиляция'],['lamp','💡 Свет']].map(([k,n])=>`<button class="btn sm ${d[k]?'':'ghost'}" ${can?'':'disabled'} onclick="setAct(${z.id},'${k}',${!d[k]},'вручную');render()">${n}: ${d[k]?'вкл':'выкл'}</button>`).join('')}</p>${can?'':'<small>Переключите зону в ручной режим.</small>'}</div>`}).join('')}</div>`;
const SET=[['tempMax','Макс. температура, °C'],['soilMin','Мин. влажность почвы, %'],['soilMax','Макс. влажность почвы, %'],['lightMin','Мин. освещённость, клк'],['humMax','Макс. влажность воздуха, %']];
R.settings=()=>`<h1>Настройки</h1><div class="card">${SET.map(([k,n])=>`<label class="fld">${n}<input id="s_${k}" type="number" value="${S.settings[k]}"></label>`).join('')}<p><button class="btn" onclick="saveSet()">Сохранить</button> <button class="btn danger" onclick="Store.reset();location.reload()">Сбросить данные</button></p><p id="msg"></p></div>`;
function saveSet(){SET.forEach(([k])=>{const v=parseFloat($('#s_'+k).value);if(!isNaN(v))S.settings[k]=v});Store.save(S);$('#msg').textContent='Настройки сохранены.'}
function badge(){const b=$('#badge'),n=S.alerts.filter(a=>!a.res&&!a.ack).length;if(b)b.textContent=n||''}
function render(){$('#view').innerHTML=R[page]();if(page==='analytics')drawAN();badge()}
$('#app').innerHTML=`<nav class="nav"><b>🌱 SmartGreenhouse</b>${PAGES.map(([h,n])=>`<a href="${h}.html" class="${h===page?'on':''}">${n}${h==='alerts'?'<i id="badge"></i>':''}</a>`).join('')}</nav><main id="view"></main>`;
render();
window.onTick=()=>{if(page==='analytics')drawAN();else if(page!=='settings'&&page!=='index')render();badge()};
