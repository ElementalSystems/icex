var grid_s=50;

function mkGrid() {
  var _ew=new Array(grid_s).fill(false);
  var _ns=new Array(grid_s).fill(false);
  var _n=new Array(grid_s).fill(0);

  return {
    get: function (x,y,d) {
      if (d%2) //e-w
        return _ew[x+y*grid_s-((d==3)?1:0)];
      else //n-s
        return _ns[x+(y-((d==0)?1:0))*grid_s];
    },
    set: function (x,y,d,st) {
      if (d%2) //e-w
        _ew[x+y*grid_s-((d==3)?1:0)]=st;
      else //n-s
        _ns[x+(y-((d==0)?1:0))*grid_s]=st;
    },
    getNode: function(x,y) {
      return _n[x+y*grid_s]
    },
    setNode: function(x,y,st) {
      _n[x+y*grid_s]=st;
    },
    drawE: function(x,y,len) {
      for (var i=0;i<len;i+=1) this.setNode(x+i,y,true);
    },
    drawS: function(x,y,len) {
      for (var i=0;i<len;i+=1) this.setNode(x,y+i,true);
    },
    drawR: function(x,y,xs,ys) {
      this.drawE(x,y,xs);
      this.drawE(x,y+ys,xs);
      this.drawS(x,y,ys);
      this.drawS(x+x2,y,ys);
    }
  };
};
