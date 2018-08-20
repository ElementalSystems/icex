function cRect(w, h) {
  return {
    w: w,
    h: h,
    chk: function(grd, x, y) {
      return true;
    },
    drw: function(grd, x, y) {
      grd.drawR(x, y, w, h);
    }
  }
}

function bGen(ty, sz, di, ring) {
  var o = Math.floor(sz / 2);
  return {
    w: sz,
    h: sz,
    chk: function(grd, x, y) {
      if (grd.checkRect(x, y, sz, sz)) return false;
      return (!grd.getNode(x + o, y + o)); //returns true if nothing at this grid location
    },
    drw: function(grd, x, y) {
      grd.drawR(x, y, sz, sz, true);
      if (di) {
        grd.drawR(x + o, y + o, 1, 1);
        grd.drawS(x + o + 1, y + o + 1, o);
      }
      if (ring) {
        grd.drawR(x + 1, y + 1, sz - 2, sz - 2);
        grd.drawS(x + 1, y, 1);
        grd.drawS(x + sz - 1, y + sz - 1, 1);
      }
      grd.setNode(x + o, y + o, ty);
    }
  }
}

var cards = {
  A: cRect(20, 3),
  B: cRect(15, 5),
  C: cRect(5, 15),
  D: cRect(10, 10),
  E: cRect(5, 5),
  '2': bGen(2, 3, true),
  '3': bGen(3, 3, true),
  '4': bGen(4, 7, false, true)
};

function dealDeck(grd, dckL) {
  var xp = rdmI(5, grid_s / 2 - 5);
  var yp = rdmI(5, grid_s / 2 - 5);
  var wp = 1,
    hp = 1;
  var rX = false,
    rY = false;
  for (var j = 0; j < dckL.length; j += 1) {
    var dck = dckL[j];
    while (dck.length) { //while we have deck
      var i = rdmI(0, dck.length - 1); //choose a random card
      var cd = cards[dck.charAt(i)];

      var x = 0;
      var y = 0;
      if (rdmI(0, 1)) { //select an edge point
        x = xp + (rX ? 0 : wp);
        y = rdmI(yp, yp + hp - 1);
      } else {
        x = rdmI(xp, xp + wp - 1);
        y = yp + (rY ? 0 : hp);
      }
      if (!rdmI(0, 5)) rX = !rX;
      if (!rdmI(0, 5)) rY = !rY;
      //shift for reverse direction
      var x = x - (rX ? cd.w : 0);
      var y = y - (rY ? cd.h : 0);
      //check it extents
      if ((x <= 0) || (x + cd.w >= grid_s)) {
        rX = !rX;
        continue;
      }
      if ((y <= 0) || (y + cd.h >= grid_s)) {
        rY = !rY;
        continue;
      }
      //run card check
      if (!cd.chk(grd, x, y)) continue;

      //draw card
      cd.drw(grd, x, y);
      //remove fromdeck
      dck = remC(dck, i)
      xp = x;
      yp = y;
      wp = cd.w;
      hp = cd.h;
    }
  }
}
