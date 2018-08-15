//returns dom element for id
function ctl(id)
{
  return document.getElementById(id);
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
