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
