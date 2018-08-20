function cRect(w, h) {
    return {
        w: w,
        h: h,
        chk: function(grd, x, y) {
            return !0;
        },
        drw: function(grd, x, y) {
            grd.drawR(x, y, w, h);
        }
    };
}

function bGen(ty, sz, di, ring) {
    var o = Math.floor(sz / 2);
    return {
        w: sz,
        h: sz,
        chk: function(grd, x, y) {
            return !grd.checkRect(x, y, sz, sz) && !grd.getNode(x + o, y + o);
        },
        drw: function(grd, x, y) {
            grd.drawR(x, y, sz, sz, !0), di && (grd.drawR(x + o, y + o, 1, 1), grd.drawS(x + o + 1, y + o + 1, o)), 
            ring && (grd.drawR(x + 1, y + 1, sz - 2, sz - 2), grd.drawS(x + 1, y, 1), grd.drawS(x + sz - 1, y + sz - 1, 1)), 
            grd.setNode(x + o, y + o, ty);
        }
    };
}

var cards = {
    A: cRect(20, 3),
    B: cRect(15, 5),
    C: cRect(5, 15),
    D: cRect(10, 10),
    E: cRect(5, 5),
    2: bGen(2, 3, !0),
    3: bGen(3, 3, !0),
    4: bGen(4, 7, !1, !0)
};

function dealDeck(grd, dckL) {
    for (var xp = rdmI(5, grid_s / 2 - 5), yp = rdmI(5, grid_s / 2 - 5), wp = 1, hp = 1, rX = !1, rY = !1, j = 0; j < dckL.length; j += 1) for (var dck = dckL[j]; dck.length; ) {
        var i = rdmI(0, dck.length - 1), cd = cards[dck.charAt(i)], x = 0, y = 0;
        rdmI(0, 1) ? (x = xp + (rX ? 0 : wp), y = rdmI(yp, yp + hp - 1)) : (x = rdmI(xp, xp + wp - 1), 
        y = yp + (rY ? 0 : hp)), rdmI(0, 5) || (rX = !rX), rdmI(0, 5) || (rY = !rY);
        x = x - (rX ? cd.w : 0), y = y - (rY ? cd.h : 0);
        x <= 0 || x + cd.w >= grid_s ? rX = !rX : y <= 0 || y + cd.h >= grid_s ? rY = !rY : cd.chk(grd, x, y) && (cd.drw(grd, x, y), 
        dck = remC(dck, i), xp = x, yp = y, wp = cd.w, hp = cd.h);
    }
}

var grid_s = 50;

function mkGrid() {
    var _ew = new Array(grid_s * grid_s).fill(!1), _ns = new Array(grid_s * grid_s).fill(!1), _n = new Array(grid_s * grid_s).fill(0);
    return {
        getL: function(x, y, d) {
            return d % 2 ? _ew[x + y * grid_s - (3 == d ? 1 : 0)] : _ns[x + (y - (0 == d ? 1 : 0)) * grid_s];
        },
        setL: function(x, y, d, st) {
            d % 2 ? _ew[x + y * grid_s - (3 == d ? 1 : 0)] = st : _ns[x + (y - (0 == d ? 1 : 0)) * grid_s] = st;
        },
        getNode: function(x, y) {
            return _n[x + y * grid_s];
        },
        checkRect: function(x, y, cx, cy) {
            for (i = 0; i < cx; i += 1) for (j = 0; j < cy; j += 1) if (this.getNode(i + x, j + y)) return !0;
            return !1;
        },
        setNode: function(x, y, st) {
            var i = x + y * grid_s;
            _n[i] < st && (_n[i] = st);
        },
        drawE: function(x, y, len) {
            for (var i = 0; i < len; i += 1) this.setL(x + i, y, 1, !0);
        },
        drawS: function(x, y, len) {
            for (var i = 0; i < len; i += 1) this.setL(x, y + i, 2, !0);
        },
        drawR: function(x, y, xs, ys, fill) {
            if (this.drawE(x, y, xs), this.drawE(x, y + ys, xs), this.drawS(x, y, ys), this.drawS(x + xs, y, ys), 
            fill) for (var i = x; i < x + xs; i += 1) for (var j = y; j < y + ys; j += 1) this.setNode(i, j, 1);
        },
        render: function(gs, end) {
            var width = 3, bs = 1 / grid_s, off = .4 * bs;
            gs.lineGrad("rgba(0,128,64,.05)", "rgba(0,255,128,.05)", "rgba(64,192,64,.05)", "rgba(0,128,0,.05)", "rgba(255,128,64,.05)", "rgba(64,128,64,.05)"), 
            asyncRepeat(() => {
                gs.startCom(), gs.lineWidth(width);
                for (var x = 1; x < grid_s; x += 1) for (var y = 1; y < grid_s; y += 1) this.getL(x, y, 1) && gs.line(x * bs - .5 + off, y * bs - .5, (x + 1) * bs - .5 - off, y * bs - .5), 
                this.getL(x, y, 2) && gs.line(x * bs - .5, y * bs - .5 + off, x * bs - .5, (y + 1) * bs - .5 - off), 
                this.getL(x, y, 1) && this.getL(x, y, 3) && gs.line(x * bs - .5 - off, y * bs - .5, x * bs - .5 + off, y * bs - .5), 
                this.getL(x, y, 0) && this.getL(x, y, 2) && gs.line(x * bs - .5, y * bs - .5 - off, x * bs - .5, y * bs - .5 + off), 
                this.getL(x, y, 0) && this.getL(x, y, 1) && gs.circle(x * bs - .5 + off, y * bs - .5 - off, off, !1, 90, 180), 
                this.getL(x, y, 0) && this.getL(x, y, 3) && gs.circle(x * bs - .5 - off, y * bs - .5 - off, off, !1, 0, 90), 
                this.getL(x, y, 1) && this.getL(x, y, 2) && gs.circle(x * bs - .5 + off, y * bs - .5 + off, off, !1, 180, 270), 
                this.getL(x, y, 2) && this.getL(x, y, 3) && gs.circle(x * bs - .5 - off, y * bs - .5 + off, off, !1, 270, 360);
                return gs.strokeCom(), (width *= .7) >= .01;
            }, () => {
                this.renderTop(gs, end);
            });
        },
        renderTop: function(gs, end) {
            for (var bs = 1 / grid_s, off = bs / 2, x = 1; x < grid_s; x += 1) for (var y = 1; y < grid_s; y += 1) switch (this.getNode(x, y)) {
              case 1:
                gs.lineStyle("rgba(192,0,0,.3)").lineWidth(.1), gs.circle(x * bs - .5 + off, y * bs - .5 + off, off / 2);
                break;

              case 2:
                gs.lineStyle("#FF0").lineWidth(.1), gs.circle(x * bs - .5 + off, y * bs - .5 + off, .8 * off);
                break;

              case 3:
                gs.lineStyle("#F0F").lineWidth(.1), gs.circle(x * bs - .5 + off, y * bs - .5 + off, .8 * off);
                break;

              case 4:
                gs.lineStyle("#00F").lineWidth(.4), gs.circle(x * bs - .5 + off, y * bs - .5 + off, .8 * off);
            }
            end && end();
        }
    };
}

var _gs = {
    startCom: function() {
        this.ctx.beginPath(), this.hold = !0;
    },
    strokeCom: function() {
        this.hold = !1, this.ctx.stroke();
    },
    line: function(x, y, x2, y2) {
        return this.hold || this.ctx.beginPath(), this.ctx.moveTo(x, y), this.ctx.lineTo(x2, y2), 
        this.hold || this.ctx.stroke(), this;
    },
    circle: function(x, y, r, fill, start, end) {
        return start = start || 0, end = end || 360, this.ctx.moveTo(x + Math.cos(2 * start * Math.PI / 360) * r, y + Math.sin(2 * start * Math.PI / 360) * r), 
        this.hold || this.ctx.beginPath(), this.ctx.arc(x, y, r, 2 * start * Math.PI / 360, 2 * end * Math.PI / 360, !1), 
        this.hold || this.ctx.stroke(), fill && this.ctx.fill(), this;
    },
    lineStyle: function(s) {
        return this.ctx.strokeStyle = s, this;
    },
    fillStyle: function(s) {
        return this.ctx.fillStyle = s, this;
    },
    lineGrad: function() {
        return this.ctx.strokeStyle = cgrad(this.ctx, .5, arguments), this;
    },
    fillGrad: function() {
        return this.ctx.fillStyle = cgrad(this.ctx, 15, arguments), this;
    },
    lineWidth: function(w) {
        return this.ctx.lineWidth = w / 100, this;
    },
    linePath: function(pts, fill) {
        this.ctx.beginPath(), this.ctx.moveTo(pts[0].x, pts[0].y);
        for (var i = 1; i < pts.length; i += 1) this.ctx.lineTo(pts[i].x, pts[i].y);
        return this.ctx.stroke(), fill && this.ctx.fill(), this;
    },
    discPath: function(pts, r, fill, shk) {
        shk || (shk = 0);
        for (var i = 0; i < pts.length; i += 1) this.ctx.beginPath(), this.ctx.arc(pts[i].x + rdm(-shk, shk), pts[i].y + rdm(-shk, shk), r, 0, 2 * Math.PI), 
        this.ctx.stroke(), fill && this.ctx.fill();
        return this;
    },
    text: function(t, x, y, h, fill) {
        return this.ctx.save(), this.ctx.lineWidth = h / 5, this.ctx.translate(-x, -y), 
        this.ctx.scale(.01 * h, .01 * h), this.ctx.font = "10px sans-serif", fill ? this.ctx.fillText(t, 0, 0) : this.ctx.strokeText(t, 0, 0), 
        this.ctx.restore(), this;
    },
    setbg: function(el) {
        var data = this.canvas.toDataURL();
        return el.style.backgroundImage = "url(" + data + ")", this;
    },
    echo: function(frames, xs, ys, xe, ye, rots, rote, ss, se, alphas, alphae) {
        for (var ngs = gs(this.res), i = 0; i < frames; i += 1) {
            var re = i / frames, rs = 1 - re;
            ngs.ctx.save(), ngs.ctx.rotate((rots * rs + rote * re) * Math.PI / 180), ngs.ctx.translate(xs * rs + xe * re, ys * rs + ye * re), 
            ngs.ctx.scale(ss * rs + se * re, ss * rs + se * re), ngs.ctx.globalAlpha = alphas * rs + alphae * re, 
            ngs.ctx.drawImage(this.canvas, -.5, -.5, 1, 1), ngs.ctx.restore();
        }
        return ngs;
    },
    rotSym: function(num) {
        return this.echo(num, 0, 0, 0, 0, 0, 360, 1, 1, 1, 1);
    },
    mirror: function(x, y) {
        var ngs = gs(this.res);
        return ngs.ctx.drawImage(this.canvas, -.5, -.5, 1, 1), ngs.ctx.scale(x ? -1 : 1, y ? -1 : 1), 
        ngs.ctx.drawImage(this.canvas, -.5, -.5, 1, 1), ngs;
    }
};

function cgrad(ctx, s, cs) {
    for (var grd = ctx.createRadialGradient(0, 0, 0, 0, 0, s), i = 0; i < cs.length; i += 1) grd.addColorStop(i / (cs.length - 1), cs[i]);
    return grd;
}

function gs(res) {
    var ngs = Object.create(_gs);
    return res || (res = 100), ngs.res = res, ngs.canvas = document.createElement("canvas"), 
    ngs.canvas.width = res, ngs.canvas.height = res, ngs.ctx = ngs.canvas.getContext("2d"), 
    ngs.ctx.translate(+ngs.canvas.width / 2, +ngs.canvas.height / 2), ngs.ctx.scale(ngs.canvas.width, ngs.canvas.height), 
    ngs.ctx.lineCap = "butt", ngs.ctx.textAlign = "center", ngs.ctx.textBaseline = "middle", 
    ngs;
}

function start() {
    var drawon = gs(100 * grid_s);
    ctl("brd").appendChild(drawon.canvas);
    var g = mkGrid();
    dealDeck(g, [ "2DDDDD", "AAAABBBB", "AAAABBBB344", "33444AABB", "CDECDECDE" ]), 
    g.render(drawon, function() {
        drawon.setbg(ctl("brd")), drawon.canvas.remove(), setTimeout(() => ctlcls("brd", "rdy"), 3e3);
    });
}

function ctl(id) {
    return document.getElementById(id);
}

function ctlcls(id, c) {
    ctl(id).classList.add(c);
}

function asyncRepeat(rep, end) {
    var f = function() {
        rep() ? requestAnimationFrame(f) : end && end();
    };
    f();
}

function rdmI(min, max) {
    return min + Math.floor(Math.random() * Math.floor(max - min + 1));
}

function rdm(min, max) {
    return min + Math.random() * (max - min);
}

function remC(s, index) {
    return s.slice(0, index) + s.slice(index + 1);
}
//# sourceMappingURL=scripts.js.map