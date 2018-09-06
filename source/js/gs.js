var _gs = {
  startCom: function() {
    this.ctx.beginPath();
    this.hold = true;
  },
  strokeCom: function() {
    this.hold = false;
    this.ctx.stroke();
  },
  line: function(x, y, x2, y2) {
    if (!this.hold) this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x2, y2);
    if (!this.hold) this.ctx.stroke();
    return this;
  },
  rect: function(x, y, x2, y2) {
    if (!this.hold) this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.rect(x, y,x2-x,y2-y);
    if (!this.hold) this.ctx.stroke();
    return this;
  },
  circle: function(x, y, r, fill, start, end) {
    start = start || 0;
    end = end || 360;

    this.ctx.moveTo(x + Math.cos(start * 2 * Math.PI / 360) * r, y + Math.sin(start * 2 * Math.PI / 360) * r);
    if (!this.hold) this.ctx.beginPath();
    this.ctx.arc(x, y, r, start * 2 * Math.PI / 360, end * 2 * Math.PI / 360, false);
    if (!this.hold) this.ctx.stroke();
    if (fill) this.ctx.fill();
    return this;
  },
  lineStyle: function(s) {
    this.ctx.strokeStyle = s;
    return this;
  },
  fillStyle: function(s) {
    this.ctx.fillStyle = s;
    return this;
  },
  lineGrad: function() {
    this.ctx.strokeStyle = cgrad(this.ctx, .5, arguments);
    return this;
  },
  fillGrad: function() {
    this.ctx.fillStyle = cgrad(this.ctx, 15, arguments);
    return this;
  },
  lineWidth: function(w) {
    this.ctx.lineWidth = w / 100;
    return this;
  },
  linePath: function(pts, fill) {
    this.ctx.beginPath();
    this.ctx.moveTo(pts[0].x, pts[0].y);
    for (var i = 1; i < pts.length; i += 1)
      this.ctx.lineTo(pts[i].x, pts[i].y);
    this.ctx.stroke();
    if (fill)
      this.ctx.fill();
    return this;
  },
  discPath: function(pts, r, fill, shk) {
    if (!shk) shk = 0
    for (var i = 0; i < pts.length; i += 1) {
      this.ctx.beginPath();
      this.ctx.arc(pts[i].x + rdm(-shk, shk), pts[i].y + rdm(-shk, shk), r, 0, 2 * Math.PI);
      this.ctx.stroke();
      if (fill) this.ctx.fill();
    }
    return this;
  },
  text: function(t, x, y, h, fill) {
    this.ctx.save();
    this.ctx.lineWidth = h / 5;
    this.ctx.translate(-x, -y);
    this.ctx.scale(.01 * h, .01 * h);
    this.ctx.font = '10px sans-serif';
    if (fill)
      this.ctx.fillText(t, 0, 0);
    else
      this.ctx.strokeText(t, 0, 0);
    this.ctx.restore();
    return this;
  },
  setbg: function(el) {
    var data = this.canvas.toDataURL();
    el.style.backgroundImage = 'url(' + data + ')';
    return this;
  },
  snap: function() {
    let data = this.canvas.toDataURL();
    return function(el) {
      //console.log("sbap set");
      el.style.backgroundImage = 'url(' + data + ')';
    }
  },
  echo: function(frames, xs, ys, xe, ye, rots, rote, ss, se, alphas, alphae) {
    var ngs = gs(this.res);
    for (var i = 0; i < frames; i += 1) {
      var re = i / frames;
      var rs = 1 - re;
      ngs.ctx.save();
      ngs.ctx.rotate((rots * rs + rote * re) * Math.PI / 180);
      ngs.ctx.translate((xs * rs + xe * re), (ys * rs + ye * re));
      ngs.ctx.scale(ss * rs + se * re, ss * rs + se * re);
      ngs.ctx.globalAlpha = alphas * rs + alphae * re;

      ngs.ctx.drawImage(this.canvas, -.5, -.5, 1, 1);
      ngs.ctx.restore();
    }
    return ngs;
  },
  rotSym: function(num) {
    return this.echo(num, 0, 0, 0, 0, 0, 360, 1, 1, 1, 1);
  },
  mirror: function(x, y) {
    var ngs = gs(this.res);
    ngs.ctx.drawImage(this.canvas, -.5, -.5, 1, 1);
    ngs.ctx.scale(x ? -1 : 1, y ? -1 : 1);
    ngs.ctx.drawImage(this.canvas, -.5, -.5, 1, 1);
    return ngs;
  }
};

function cgrad(ctx, s, cs) {
  var grd = ctx.createRadialGradient(0, 0, 0, 0, 0, s);
  for (var i = 0; i < cs.length; i += 1)
    grd.addColorStop(i / (cs.length - 1), cs[i]);
  return grd;
}


function gs(res) {
  var ngs = Object.create(_gs);

  if (!res) res = 100;
  ngs.res = res;
  ngs.canvas = document.createElement("canvas");
  ngs.canvas.width = res;
  ngs.canvas.height = res;
  ngs.ctx = ngs.canvas.getContext('2d');
  ngs.ctx.translate(+ngs.canvas.width / 2, +ngs.canvas.height / 2);
  ngs.ctx.scale(ngs.canvas.width, ngs.canvas.height);
  ngs.ctx.lineCap = 'butt';
  ngs.ctx.textAlign = 'center';
  ngs.ctx.textBaseline = 'middle';

  return ngs;
}
