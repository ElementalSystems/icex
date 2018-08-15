var grid_s = 50;

function mkGrid() {
    var _ew = new Array(grid_s).fill(!1), _ns = new Array(grid_s).fill(!1), _n = new Array(grid_s).fill(0);
    return {
        get: function(x, y, d) {
            return d % 2 ? _ew[x + y * grid_s - (3 == d ? 1 : 0)] : _ns[x + (y - (0 == d ? 1 : 0)) * grid_s];
        },
        set: function(x, y, d, st) {
            d % 2 ? _ew[x + y * grid_s - (3 == d ? 1 : 0)] = st : _ns[x + (y - (0 == d ? 1 : 0)) * grid_s] = st;
        },
        getNode: function(x, y) {
            return _n[x + y * grid_s];
        },
        setNode: function(x, y, st) {
            _n[x + y * grid_s] = st;
        },
        drawE: function(x, y, len) {
            for (var i = 0; i < len; i += 1) this.setNode(x + i, y, !0);
        },
        drawS: function(x, y, len) {
            for (var i = 0; i < len; i += 1) this.setNode(x, y + i, !0);
        },
        drawR: function(x, y, xs, ys) {
            this.drawE(x, y, xs), this.drawE(x, y + ys, xs), this.drawS(x, y, ys), this.drawS(x + x2, y, ys);
        }
    };
}

var _gs = {
    line: function(x, y, x2, y2) {
        return this.ctx.beginPath(), this.ctx.moveTo(x, y), this.ctx.lineTo(x2, y2), this.ctx.stroke(), 
        this;
    },
    circle: function(x, y, r, fill) {
        return this.ctx.beginPath(), this.ctx.arc(x, y, r, 0, 2 * Math.PI, !1), this.ctx.stroke(), 
        fill && this.ctx.fill(), this;
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
    ngs.ctx.lineCap = "round", ngs.ctx.textAlign = "center", ngs.ctx.textBaseline = "middle", 
    ngs;
}

function start() {
    var g = mkGrid(), drawon = gs(50 * grid_s);
    ctl("brd").appendChild(drawon.canvas);
    var width = 1;
    drawon.lineStyle("#0F0").lineWidth(.25).line(-.4, -.4, .4, .4), drawon.lineGrad("rgba(0,128,64,.05)", "rgba(0,255,128,.05)", "rgba(64,192,64,.05)", "rgba(0,128,0,.05)", "rgba(0,128,64,.05)", "rgba(64,128,64,.05)"), 
    asyncRepeat(() => (drawon.lineWidth(width).line(0, -.5, 0, .5).line(0, 0, .5, 0).circle(.1, .1, .1).circle(.05, -.05, .05), 
    (width -= .08) > 0), () => {
        drawon.lineGrad("#F00", "#00F", "#0FF", "#F00", "#00F", "#0FF").lineWidth(.25).line(.2, -.4, .3, .2);
    }), g.drawR(5, 5, 5, 5);
}

function ctl(id) {
    return document.getElementById(id);
}

function asyncRepeat(rep, end) {
    var f = function() {
        rep() ? requestAnimationFrame(f) : end && end();
    };
    f();
}
//# sourceMappingURL=scripts.js.map