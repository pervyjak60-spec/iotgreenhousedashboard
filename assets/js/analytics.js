const AN={z:1,k:'temp'};
function chart(v,u){
  const w=600,h=200,mn=Math.min(...v),mx=Math.max(...v),r=mx-mn||1;
  const p=v.map((x,i)=>`${(i/(v.length-1)*w).toFixed(1)},${(h-14-(x-mn)/r*(h-28)).toFixed(1)}`).join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" class="chart"><polyline points="${p}" fill="none" stroke="var(--g)" stroke-width="2.5"/><text x="4" y="12">${f(mx)} ${u}</text><text x="4" y="${h-2}">${f(mn)} ${u}</text></svg>`;
}
function recs(){
  const c=S.settings,out=[];
  ZONES.forEach(z=>{
    const hs=S.hist[z.id],d=S.zones[z.id],avg=k=>hs.reduce((a,x)=>a+x[k],0)/hs.length;
    if(avg('soil')<c.soilMin+8)out.push(`${z.name}: почва в среднем ${f(avg('soil'),0)} %. Поднимите порог полива или добавьте капельную линию.`);
    if(avg('temp')>c.tempMax-3)out.push(`${z.name}: температура держится у верхней границы (${f(avg('temp'))} °C). Включайте вентиляцию раньше или добавьте притенение.`);
    if(avg('hum')>c.humMax-10)out.push(`${z.name}: влажность воздуха высокая, есть риск грибковых болезней. Проветривайте чаще.`);
    if(d.water>40)out.push(`${z.name}: израсходовано ${f(d.water,0)} л воды. Проверьте, нет ли утечек и лишних поливов.`);
  });
  return out.length?out:['Все параметры в норме, рекомендаций нет.'];
}
function drawAN(){
  const el=$('#an');if(!el)return;
  const v=S.hist[AN.z].map(x=>x[AN.k]),u=SENSORS.find(s=>s.k===AN.k).u;
  const avg=v.reduce((a,b)=>a+b,0)/v.length;
  el.innerHTML=`${chart(v,u)}<p>Среднее: <b>${f(avg)} ${u}</b> · Мин: <b>${f(Math.min(...v))}</b> · Макс: <b>${f(Math.max(...v))}</b></p>`;
}
R.analytics=()=>`<h1>Аналитика</h1><div class="card"><p>
<select onchange="AN.z=+this.value;drawAN()">${ZONES.map(z=>`<option value="${z.id}" ${z.id===AN.z?'selected':''}>${z.name}</option>`).join('')}</select>
<select onchange="AN.k=this.value;drawAN()">${SENSORS.map(s=>`<option value="${s.k}" ${s.k===AN.k?'selected':''}>${s.n}</option>`).join('')}</select></p><div id="an"></div></div>
<h2>Расход воды</h2><div class="grid">${ZONES.map(z=>`<div class="card kpi"><small>${z.icon} ${z.name}</small><b>${f(S.zones[z.id].water,1)} л</b></div>`).join('')}</div>
<h2>Рекомендации</h2><div class="card">${recs().map(r=>`<div class="row">💡 <span>${r}</span></div>`).join('')}</div>`;
