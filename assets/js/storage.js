const Store={
  load(){try{return JSON.parse(localStorage.getItem('greenhouse'))}catch(e){return null}},
  save(s){try{localStorage.setItem('greenhouse',JSON.stringify(s))}catch(e){}},
  reset(){try{localStorage.removeItem('greenhouse')}catch(e){}}
};
let S=Store.load();
if(!S||!S.zones)S=initState();
