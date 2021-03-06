var _pressed = {};
var _lastT={x:10,y:10};
var _usedrt=false;
var _drtt=0;

function attachKb(el) { //set up and attach the keyboard
  el.onkeydown = function(e) {
    e = e || window.event;
    _pressed[e.keyCode] = true;
  }
  el.onkeyup = function(e) {
    e = e || window.event;
    _pressed[e.keyCode] = false;
  }
  el.focus();
}

function attachDp(el,del)
{
    function h(e) {
      _lastT=getEventPos(el,e);
    }
    el.onmousemove=h;
    el.onmousedown=h;
    el.ontouchmove=h;
    el.ontouchstart=h;
    del.onclick=function()
    {
      _usedrt=true;
    }
}

function userController(ft, t) { //bike controller attached to the keyboard
  this.dp1 = -1;
  this.dp2 = -1;
  _drtt-=ft;
  if (_pressed[38]||_pressed[87]) this.dp1=0;
  if (_pressed[40]||_pressed[83]) this.dp1=2;
  if (_pressed[37]||_pressed[65]) this.dp2=3;
  if (_pressed[39]||_pressed[68]) this.dp2=1;
  if ((this.dp1<0)&&(this.dp2<0)) { //no keys - try the D-pad thing
    if ((_lastT.x>-1)&&(_lastT.x<1)) { //has been touched
      if (_lastT.x>.2) this.dp1=1;
      if (_lastT.x<-.2) this.dp1=3;
    }
    if ((_lastT.y>-1)&&(_lastT.y<1)) { //has been touched
      if (_lastT.y>.2) this.dp2=2;
      if (_lastT.y<-.2) this.dp2=0;
    }
  } else {
    //we used the keys so clear the touchpoint
    _lastT={x:10,y:10};
  }
  //what about a distort
  if ((_drtt<0)&&((_usedrt)||(_pressed[32]))) {
    this.brd.trackEnt.placeDrt();
    _usedrt=false;
    _drtt=.2;
  }
}

function mkAiCtl(brd)
{
  let time=0;
  return function (ft, t) {
    time-=ft;
    max=1;
    if (time<0) {
      let xdf=brd.trackEnt.x-this.x;
      let ydf=brd.trackEnt.y-this.y;
      let dist=Math.abs(xdf)+Math.abs(ydf);
      if ((dist>15)&&(!rdmI(0,9))) { //far away maybe act a crazy random one time in ten
        xdf*=-1;
        ydf*=-1;
        max=3;
      } else if ((dist>5)&&(!rdmI(0,4))) { //occasionally aim towards where the user is going
        xdf+=xd(brd.trackEnt.dir)*10;
        ydf+=yd(brd.trackEnt.dir)*10;
      }
      this.dp1 = (xdf>0)?1:3;
      this.dp2 = (ydf>0)?2:0;
      if (Math.abs(ydf)>Math.abs(xdf)) { //swap them
        var t=this.dp1;
        this.dp1=this.dp2;
        this.dp2=t;
      }
      time=rdm(0.25,max);
    }
  }
  //dumb random controller
  return function (ft, t) {
    time-=ft;
    if (time<0) {//do something
      this.dp1 = rdmI(0,3);
      this.dp2 = (this.dp1+1+rdmI(0,1)*2)%4;
      time=rdm(3,6);
    }
  }
}
