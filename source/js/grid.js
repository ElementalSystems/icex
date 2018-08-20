var grid_s = 50;

function mkGrid() {
  var _ew = new Array(grid_s * grid_s).fill(false);
  var _ns = new Array(grid_s * grid_s).fill(false);
  var _n = new Array(grid_s * grid_s).fill(0);

  return {
    getL: function(x, y, d) {
      if (d % 2) //e-w
        return _ew[x + y * grid_s - ((d == 3) ? 1 : 0)];
      else //n-s
        return _ns[x + (y - ((d == 0) ? 1 : 0)) * grid_s];
    },
    setL: function(x, y, d, st) {
      if (d % 2) //e-w
        _ew[x + y * grid_s - ((d == 3) ? 1 : 0)] = st;
      else //n-s
        _ns[x + (y - ((d == 0) ? 1 : 0)) * grid_s] = st;
    },
    getNode: function(x, y) {
      return _n[x + y * grid_s];
    },
    checkRect: function(x, y, cx, cy) {
      for (i = 0; i < cx; i += 1)
        for (j = 0; j < cy; j += 1)
          if (this.getNode(i+x, j+y)) return true;
      return false;
    },
    setNode: function(x, y, st) {
      var i = x + y * grid_s;
      if (_n[i] < st) _n[i] = st;
    },
    drawE: function(x, y, len) {
      for (var i = 0; i < len; i += 1) this.setL(x + i, y, 1, true);
    },
    drawS: function(x, y, len) {
      for (var i = 0; i < len; i += 1) this.setL(x, y + i, 2, true);
    },
    drawR: function(x, y, xs, ys, fill) {
      this.drawE(x, y, xs);
      this.drawE(x, y + ys, xs);
      this.drawS(x, y, ys);
      this.drawS(x + xs, y, ys);
      if (fill)
        for (var i = x; i < x + xs; i += 1)
          for (var j = y; j < y + ys; j += 1) this.setNode(i, j, 1);
    },

    render: function(gs, end) {
      var width = 3;
      var bs = 1 / grid_s; //size of a block in graphic space
      var off = bs * .4;
      gs.lineGrad("rgba(0,128,64,.05)", "rgba(0,255,128,.05)", "rgba(64,192,64,.05)", "rgba(0,128,0,.05)", "rgba(255,128,64,.05)", "rgba(64,128,64,.05)");
      asyncRepeat(
        () => {
          gs.startCom();
          gs.lineWidth(width);
          for (var x = 1; x < grid_s; x += 1)
            for (var y = 1; y < grid_s; y += 1) {
              //draw e link
              if (this.getL(x, y, 1))
                gs.line(-.5 + x * bs + off, -.5 + y * bs, -.5 + (x + 1) * bs - off, -.5 + y * bs);
              //draw s link
              if (this.getL(x, y, 2))
                gs.line(-.5 + x * bs, -.5 + y * bs + off, -.5 + x * bs, -.5 + (y + 1) * bs - off);
              //draw an ew link
              if (this.getL(x, y, 1) && this.getL(x, y, 3))
                gs.line(-.5 + x * bs - off, -.5 + y * bs, -.5 + x * bs + off, -.5 + y * bs);
              //draw an ns link
              if (this.getL(x, y, 0) && this.getL(x, y, 2))
                gs.line(-.5 + x * bs, -.5 + y * bs - off, -.5 + x * bs, -.5 + y * bs + off);
              //draw an ne link
              if (this.getL(x, y, 0) && this.getL(x, y, 1))
                gs.circle(-.5 + x * bs + off, -.5 + y * bs - off, off, false, 90, 180);
              //draw an nw link
              if (this.getL(x, y, 0) && this.getL(x, y, 3))
                gs.circle(-.5 + x * bs - off, -.5 + y * bs - off, off, false, 0, 90);
              //draw an se link
              if (this.getL(x, y, 1) && this.getL(x, y, 2))
                gs.circle(-.5 + x * bs + off, -.5 + y * bs + off, off, false, 180, 270);
              //draw an sw link
              if (this.getL(x, y, 2) && this.getL(x, y, 3))
                gs.circle(-.5 + x * bs - off, -.5 + y * bs + off, off, false, 270, 360);
            }
          gs.strokeCom();
          width *= .7;
          //width-=.3;

          return width >= 0.01;
        },
        () => {
          this.renderTop(gs, end);
        }
      );
    },
    renderTop: function(gs, end) {
      var bs = 1 / grid_s; //size of a block in graphic space
      var off = bs / 2;
      for (var x = 1; x < grid_s; x += 1)
        for (var y = 1; y < grid_s; y += 1)
          switch (this.getNode(x, y)) {
            case 1:
              gs.lineStyle("rgba(192,0,0,.3)").lineWidth(.1);
              gs.circle(-.5 + x * bs + off, -.5 + y * bs + off, off / 2);
              break;
            case 2:
              gs.lineStyle("#FF0").lineWidth(.1);
              gs.circle(-.5 + x * bs + off, -.5 + y * bs + off, off * .8);
              break;
            case 3:
              gs.lineStyle("#F0F").lineWidth(.1);
              gs.circle(-.5 + x * bs + off, -.5 + y * bs + off, off * .8);
              break;
            case 4:
              gs.lineStyle("#00F").lineWidth(.4);
              gs.circle(-.5 + x * bs + off, -.5 + y * bs + off, off * .8);
              break;
          }

      if (end) end();
    }
  };
}
