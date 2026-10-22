const R={};
const $=s=>document.querySelector(s);
const f=(v,d=1)=>Number(v).toFixed(d);
const ZONES=[{id:1,name:'Томаты',icon:'🍅'},{id:2,name:'Огурцы',icon:'🥒'},{id:3,name:'Зелень',icon:'🌿'}];
const SENSORS=[{k:'temp',n:'Температура',u:'°C'},{k:'hum',n:'Влажность воздуха',u:'%'},{k:'soil',n:'Влажность почвы',u:'%'},{k:'light',n:'Освещённость',u:'клк'},{k:'co2',n:'CO₂',u:'ppm'}];
const DEFAULTS={tempMax:30,soilMin:35,soilMax:70,lightMin:8,humMax:85,auto:true};
function initState(){
  const s={settings:{...DEFAULTS},alerts:[],log:[],zones:{},hist:{}};
  ZONES.forEach(z=>{
    s.zones[z.id]={temp:22+z.id,hum:62,soil:50,light:10,co2:430,pump:false,vent:false,lamp:false,mode:'auto',online:true,water:0};
    s.hist[z.id]=Array.from({length:40},(_,i)=>({temp:22+Math.sin(i/6)*3+z.id*.5,hum:60+Math.cos(i/5)*8,soil:55-i*.2+Math.random()*3,light:10+Math.sin(i/6)*6,co2:430+Math.random()*40}));
  });
  return s;
}
