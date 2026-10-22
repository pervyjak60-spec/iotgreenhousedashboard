const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const rnd=a=>(Math.random()-.5)*a;
function simulate(){
  const t=new Date(),h=t.getHours()+t.getMinutes()/60;
  const sun=Math.max(0,Math.sin((h-6)/14*Math.PI));
  ZONES.forEach(z=>{
    const d=S.zones[z.id];if(!d.online)return;
    d.temp=clamp(d.temp+(16+sun*14-d.temp)*.04+rnd(.5)-(d.vent?.9:0)+(d.lamp?.2:0),5,45);
    d.hum=clamp(d.hum+(60-d.hum)*.05+rnd(1.5)+(d.pump?2.5:0)-(d.vent?1.5:0),20,99);
    d.soil=clamp(d.soil-.5+rnd(.3)+(d.pump?3.5:0),0,100);
    d.light=clamp(sun*14+(d.lamp?6:0)+rnd(.6),0,30);
    d.co2=clamp(d.co2+(420-d.co2)*.05+rnd(20)-(d.vent?15:0),300,1500);
    if(d.pump)d.water+=.5;
    const hs=S.hist[z.id];
    hs.push({temp:d.temp,hum:d.hum,soil:d.soil,light:d.light,co2:d.co2});
    if(hs.length>60)hs.shift();
  });
  automation();checkAlerts();Store.save(S);
}
setInterval(()=>{simulate();window.onTick&&onTick()},2000);
