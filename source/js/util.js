//returns dom element for id
function ctl(id)
{
  return document.getElementById(id);
}

function ctlcls(id,c)
{
  ctl(id).classList.add(c);
}

function asyncRepeat(rep,end)
{
  var f=function() {
    if (rep())
      requestAnimationFrame(f)
    else if (end) end();
  };
  f();
}

function rdmI(min,max) {
  return min+Math.floor(Math.random() * Math.floor(max-min+1));
}

function rdm(min,max) {
  return min+Math.random() * (max-min);
}

function remC(s,index) {
  return s.slice(0, index) + s.slice(index+1);
}

function mkDiv(cls,cls2)
{
  let d=document.createElement('div');
  d.classList.add(cls);
  if (cls2) d.classList.add(cls2);
  return d;
}

function mkDivT(cls,cls2,dep)
{
  let d=mkDiv(cls,cls2)
  if (dep>0) {
    d.appendChild(mkDivT('l',null,dep-1));
    d.appendChild(mkDivT('r',null,dep-1))
  }
  return d;
}
