var grid_s = 50;

function mkGrid() {
  var _ew = new Array(grid_s * grid_s).fill(false);
  var _ns = new Array(grid_s * grid_s).fill(false);
  var _n = new Array(grid_s * grid_s).fill(0);

  return {
    getL: function(x, y, d) {
      if (d < 0) return false; //no direction is never available!s
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
          if (this.getNode(i + x, j + y)) return true;
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

    //choose which way we can go from this intersection
    // d1 - first choice
    // d2 - second choice
    // dc - current direction
    selDir: function(d1, d2, dc, x, y) {
      if (this.getL(x, y, d1)) return d1; //if we can go the direction we want
      if (this.getL(x, y, d2)) return d2; //or the other
      if (this.getL(x, y, dc)) return dc; //or go straight
      if (this.getL(x, y, (dc + 1) % 4)) return (dc + 1) % 4; //or left
      if (this.getL(x, y, (dc + 3) % 4)) return (dc + 3) % 4; //or right
      return (dc + 2) % 4; //have to go backwards!
    },

    render: function(gs, cols,end) {
      var width = 5;
      var bs = 1 / grid_s; //size of a block in graphic space
      var off = bs * .4;
      gs.lineGradA(cols); //pass array as params
      asyncRepeat(
        () => {
          width *= .7;
          gs.lineWidth(width);
          if (width<.005)
            gs.lineStyle("rgba(0,0,255,1)").lineWidth(.005);
          gs.startCom();

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

          return width >= 0.005;
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
              //gs.lineStyle("rgba(192,0,0,.3)").lineWidth(.1);
              //gs.circle(-.5 + x * bs + off, -.5 + y * bs + off, off / 2);
              break;
            case 2:
              gs.lineStyle("#FF0").lineWidth(.1);
              gs.circle(-.5 + x * bs + off, -.5 + y * bs + off, off * .8);
              break;
            case 3:
              gs.lineStyle("#F00").lineWidth(.1);
              gs.circle(-.5 + x * bs + off, -.5 + y * bs + off, off * .8);
              break;
          }

      if (end) end();
    }
  };
}
