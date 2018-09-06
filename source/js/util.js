//returns dom element for id
function ctl(id)
{
  return document.getElementById(id);
}

function ctlcls(id,c)
{
  ctl(id).classList.add(c);
}

function dist(a,b)
{
  return Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
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

function mkDivC(clr)
{
  if (!clr) return null;
  let d=document.createElement('div');
  d.style.backgroundColor=clr;
  return d;
}

function mkDivT(cls,cls2,dep,dec)
{
  let d=mkDiv(cls,cls2);
  if (!dec) dec=cls;
  if (dep>0) {
    let l=mkDivT('l',null,dep-1,dec);
    decorate(l,dec+'_'+dep+'l'); decorate(l,dec+'_'+dep);
    d.appendChild(l);

    let r=mkDivT('r',null,dep-1,dec);
    decorate(r,dec+'_'+dep+'r'); decorate(r,dec+'_'+dep);
    d.appendChild(r);
  }
  return d;
}

function getEventPos( el, e ) {
    var rect = el.getBoundingClientRect();
    var x=e.touches ? e.touches[ 0 ].clientX : e.clientX;
    var y=e.touches ? e.touches[ 0 ].clientY : e.clientY;
    return {
        x: ( x - rect.left ) / ( rect.right - rect.left) -.5,
        y: ( y - rect.top ) / ( rect.bottom - rect.top ) -.5
    };
}

function xd(d)
{
  return ((d%2)?((d==1)?1:-1):0)
}

function yd(d)
{
  return ((d%2)?0:((d==2)?1:-1))
}
