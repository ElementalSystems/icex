function mkEnt(t, x, y) {
  let cls = 'ent';
  let depth = 1;
  let init = function() {};
  let tick = function() {
    return false
  };

  switch (t) {
    case 2: //player start position
      init = function() { this.brd.addEnt(mkEnt(10,this.x, this.y));  }
      break;
    case 10: //player Bike
      depth=0;
      cls='bike';
      init = function() { this.bx=x; this.by=y; this.dir=0; this.lpos=0; this.brd.trackEnt=this; };
      tick=function(ft,t) {
        this.lpos+=(ft*2);
        if (this.lpos>1) { //move us on the next hex
          this.lpos-=1;
          switch (this.dir) {
            case 0:
              this.bx+=1;
              break;
            case 1:
              this.by+=1;
              break;
            case 2:
              this.bx-=1;
              break;
            case 3:
              this.by-=1;
              break;
          }
        }
        //set our position
        switch (this.dir) {
          case 0:
            this.x=this.bx+this.lpos; this.y=this.by;
            break;
          case 1:
            this.x=this.bx; this.y=this.by+this.lpos;
            break;
          case 2:
            this.x=this.bx+1-this.lpos; this.y=this.by;
            break;
          case 3:
            this.x=this.bx; this.y=this.by+1-this.lpos;
            break;
        }
        this.zrot=this.dir*90;
        return true;
      }
      break;
  }

  let e = {
    el: mkDivT(cls + '_' + t, cls, depth),
    ty: t,
    x: x,
    y: y,
    zrot: 0,
    put: function() {
      this.el.style.transform = "translate3d(" + (this.x / grid_s * 600) + "vh," + (this.y / grid_s * 600) + "vh,0) rotateZ(" + this.zrot + "deg)"
    },
    init: init,
    tick: tick
  }
  return e;
}
