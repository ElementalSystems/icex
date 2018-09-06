function mkBoard(deck) {
    var drawon = gs(40 * grid_s);
    let bel = ctl("brd"), hel = ctl("hud"), dpel = ctl("dirctl"), drtel = ctl("drtctl"), lvctl = ctl("lvctl"), fctl = ctl("fctl"), scel = ctl("scctl");
    ctl("top");
    bel.appendChild(drawon.canvas);
    var g = mkGrid();
    dealDeck(g, deck);
    let brd = {
        ents: [],
        inPlay: !0,
        addEnt: function(e) {
            e.brd = brd, brd.ents.push(e), bel.appendChild(e.el), e.hudel && hel.appendChild(e.hudel), 
            e.init(), e.reset(), e.put();
        },
        score: 0,
        lives: 3,
        incScore: function(inc, txt, cls) {
            brd.score += inc, scel.innerText = brd.score, txt && toast("<b>+" + inc + "</b> " + txt, cls);
        },
        incLv: function(inc) {
            brd.lives += inc, lvctl.innerText = brd.lives;
        },
        death: function() {
            this.incLv(-1);
            for (let i = 0; i < this.ents.length; i += 1) this.ents[i].reset();
        },
        g: g
    };
    toast("...Designing Level...", "bad"), g.render(drawon, function() {
        drawon.setbg(bel), drawon.canvas.remove(), ctlcls("brd", "rdy"), function() {
            for (let i = 0; i < grid_s; i += 1) for (let j = 0; j < grid_s; j += 1) {
                let v = g.getNode(i, j);
                v && 1 != v && brd.addEnt(mkEnt(v, i, j));
            }
        }(), attachKb(bel), attachDp(dpel, drtel), requestAnimationFrame(gl);
    });
    let st = 0;
    function gl(t) {
        let ft = .01;
        st && (ft = (t - st) / 1e3), ft > .1 && (ft = .1), st = t;
        for (let i = 0; i < brd.ents.length; i += 1) brd.ents[i].tick(ft, t) && brd.ents[i].put();
        for (let i = 0; i < brd.ents.length; i += 1) for (let j = i; j < brd.ents.length; j += 1) e1 = brd.ents[i], 
        e2 = brd.ents[j], dist(e1, e2) > .5 || (e1.collision(e2), e2.collision(e1));
        var e1, e2;
        brd.trackEnt && (fctl.innerText = Math.floor(brd.trackEnt.fuel), bel.style.transform = "translate3d(" + (70 - brd.trackEnt.x / grid_s * 600) + "vmin," + (50 - brd.trackEnt.y / grid_s * 600) + "vmin,0)"), 
        brd.inPlay && requestAnimationFrame(gl);
    }
    return brd.incScore(0), brd.incLv(0), brd;
}

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
            grd.drawR(x, y, sz, sz, !0), di && (grd.drawR(x + o, y + o, 1, 1), grd.drawS(x + o + 1, y + o + 1, o), 
            grd.drawS(x + 1, y, o)), ring && (grd.drawR(x + 1, y + 1, sz - 2, sz - 2), grd.drawS(x + 1, y, 1), 
            grd.drawS(x + sz - 1, y + sz - 1, 1)), grd.setNode(x + o, y + o, ty);
        }
    };
}

var cards = {
    A: cRect(20, 3),
    B: cRect(15, 5),
    C: cRect(5, 15),
    D: cRect(10, 10),
    E: cRect(5, 5),
    F: cRect(2, 2),
    G: cRect(1, 10),
    H: cRect(10, 1),
    2: bGen(2, 3, !0),
    3: bGen(3, 3, !0),
    4: bGen(4, 7, !1, !0),
    5: bGen(5, 7, !1, !0),
    6: bGen(6, 7, !1, !0)
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

var _pressed = {}, _lastT = {
    x: 10,
    y: 10
}, _usedrt = !1, _drtt = 0;

function attachKb(el) {
    el.onkeydown = function(e) {
        e = e || window.event, _pressed[e.keyCode] = !0;
    }, el.onkeyup = function(e) {
        e = e || window.event, _pressed[e.keyCode] = !1;
    }, el.focus();
}

function attachDp(el, del) {
    function h(e) {
        _lastT = getEventPos(el, e);
    }
    el.onmousemove = h, el.onmousedown = h, el.ontouchmove = h, el.ontouchstart = h, 
    del.onclick = function() {
        _usedrt = !0;
    };
}

function userController(ft, t) {
    this.dp1 = -1, this.dp2 = -1, _drtt -= ft, _pressed[38] && (this.dp1 = 0), _pressed[40] && (this.dp1 = 2), 
    _pressed[37] && (this.dp2 = 3), _pressed[39] && (this.dp2 = 1), this.dp1 < 0 && this.dp2 < 0 ? (_lastT.x > -1 && _lastT.x < 1 && (_lastT.x > .2 && (this.dp1 = 1), 
    _lastT.x < -.2 && (this.dp1 = 3)), _lastT.y > -1 && _lastT.y < 1 && (_lastT.y > .2 && (this.dp2 = 2), 
    _lastT.y < -.2 && (this.dp2 = 0))) : _lastT = {
        x: 10,
        y: 10
    }, _drtt < 0 && (_usedrt || _pressed[32]) && (this.brd.trackEnt.placeDrt(), _usedrt = !1, 
    _drtt = .2);
}

function mkAiCtl(brd) {
    let time = 0;
    return function(ft, t) {
        if ((time -= ft) < 0) {
            let xd = brd.trackEnt.x - this.x, yd = brd.trackEnt.y - this.y;
            if (this.dp1 = xd > 0 ? 1 : 3, this.dp2 = yd > 0 ? 2 : 0, Math.abs(yd) > Math.abs(xd)) {
                t = this.dp1;
                this.dp1 = this.dp2, this.dp2 = t;
            }
            time = rdm(.25, 1);
        }
    };
}

let decore = {};

function mkDecor() {
    decore = {
        bike_10_1: gs().lineStyle("#FF8").lineWidth(15).line(-.3, -.4, .3, -.4).line(.3, -.4, -.3, .4).line(-.3, -.4, -.3, .4).echo(8, 0, 0, 0, 0, 0, 0, 1, .1, .5, .2).snap(),
        bike_10_2: gs().lineStyle("#FF0").fillStyle("rgba(255,255,0,.2)").lineWidth(2).circle(0, 0, .45, !0).echo(3, 0, 0, 0, 0, 0, 0, 1, .1, 1, .4).snap(),
        bike_11_1: gs().lineStyle("#F44").lineWidth(15).line(-.4, -.4, .4, -.4).line(.4, -.4, -.4, .4).line(-.3, -.4, -.3, .4).echo(8, 0, 0, 0, 0, 0, 0, 1, .01, .5, .2).snap(),
        bike_11_2: gs().lineStyle("#F00").fillStyle("rgba(255,0,0,.2)").lineWidth(2).circle(0, 0, .45, !0).echo(3, 0, 0, 0, 0, 0, 0, 1, .1, 1, .4).snap(),
        ent_4_1: gs().lineStyle("#80F").lineWidth(2).fillStyle("rgba(128,0,255,.5)").circle(0, 0, .4).circle(0, 0, .3, !0).circle(0, 0, .2).snap(),
        ent_4_2: gs().lineStyle("#20F").lineWidth(5).fillStyle("rgba(0,0,255,.5)").circle(0, 0, .4).circle(0, 0, .3, !0).circle(0, 0, .2).snap(),
        ent_5_1: gs(150).lineGrad("rgba(0,0,192,.5)", "rgba(0,0,128,.5)", "rgba(0,0,255,.5)").lineWidth(8).line(-.45, -.45, .45, .1).line(-.45, -.45, .45, .2).line(-.45, -.45, .45, .3).line(-.45, -.45, .45, .4).rotSym(3).snap(),
        ent_5_2: gs().lineStyle("#88F").lineWidth(5).rect(-.3, -.3, .3, .3).snap(),
        ent_5_3: gs().lineStyle("#008").lineWidth(8).rect(-.1, -.45, .1, .45).rect(-.45, -.1, .45, .1).snap(),
        ent_6_1: gs().lineStyle("#0F0").lineWidth(2).rect(-.35, -.35, .35, .35).rect(-.25, -.25, .25, .25).rect(-.15, -.15, .15, .15).snap(),
        ent_6_2: gs().lineStyle("rgba(0,255,0,.5)").lineWidth(12).rect(-.4, -.4, .4, .4).rect(-.15, -.15, .15, .15).snap(),
        ent_6_3: gs().lineStyle("rgba(192,192,255,.8)").lineWidth(2).rect(-.45, -.45, .45, .45).rect(-.4, -.4, .4, .4).rect(-.35, -.35, .35, .35).snap(),
        drt_16_1: gs().lineGrad("rgba(0,192,255,.3)", "rgba(0,0,255,.6)").lineWidth(5).line(-.1, -.4, 0, -.3).line(-.2, -.2, 0, -.3).line(-.2, -.2, 0, -.1).echo(12, 0, 0, 0, 0, 0, 720, 1, .5, 1, 1).snap()
    }, gs(100).lineStyle("#0F0").lineWidth(4).line(.45, 0, .3, -.1).line(.45, 0, .3, .1).echo(3, 0, 0, 0, 0, 0, 0, 1, .3, 1, .5).echo(8, 0, 0, 0, 0, 0, 359, 1, 1, 1, 1).setbg(ctl("dirctl")), 
    decorate(ctl("drtctl"), "drt_16_1");
}

function decorate(el, cls) {
    decore[cls] && decore[cls](el);
}

function mkEnt(t, x, y) {
    let cls = "ent", depth = 1, hudclr = null, init = function() {}, tick = function() {
        return !1;
    }, collision = function() {}, reset = function() {};
    switch (t) {
      case 2:
      case 3:
        init = function() {
            this.brd.addEnt(mkEnt(t + 8, this.x, this.y));
        };
        break;

      case 4:
      case 5:
      case 6:
        depth = 3, init = function() {
            let self = this;
            function mkLock(x, y) {
                let e = mkEnt(15, self.x + x, self.y + y);
                return e.parent = self, e;
            }
            this.lcks = 4, this.lcksdead = 0, this.unlock = function() {
                self.lcksdead += 1, self.sizeMe(), this.brd.incScore(100 * this.lcksdead, "Program subsystems online", "s2"), 
                this.lcks == this.lcksdead && this.brd.incScore(1e3, "Program Liberated", "s3");
            }, this.sizeMe = function() {
                let sc = .2 + .4 * this.lcksdead;
                this.pel.style.transform = "scale3d(" + sc + "," + sc + "," + sc + ")";
            }, this.sizeMe(), this.brd.addEnt(mkLock(.5, -2)), this.brd.addEnt(mkLock(.5, 3)), 
            this.brd.addEnt(mkLock(-2, .5)), this.brd.addEnt(mkLock(3, .5));
        };
        break;

      case 10:
      case 11:
        depth = 2, cls = "bike", hudclr = 10 == t ? "#FF0" : "#F00", reset = function() {
            this.x = this.bx = x, this.y = this.by = y, this.dir = 1, this.dp1 = -1, this.dp2 = -1, 
            this.lpos = 0, this.stuntime = 10 == this.ty ? 2 : 5, this.fuel = 100, this.pel.classList.toggle("start", !0), 
            this.pel.classList.toggle("stun", !1), this.pel.classList.toggle("death", !1), toast("downloading...", "s3");
        }, init = function() {
            if (this.fuel = 100, 10 == t && (this.brd.trackEnt = this), this.control = 10 == t ? userController : mkAiCtl(this.brd), 
            this.stun = function() {
                this.stuntime > 0 || (this.pel.classList.toggle("stun", !0), this.stuntime = 1);
            }, this.stuntime = -1, 10 == t) {
                this.drtc = 0, this.drt = [];
                for (var i = 0; i < 10; i += 1) {
                    let x = mkEnt(16, -1, -1);
                    this.drt.push(x), this.fuel = 100, this.brd.addEnt(x);
                }
                this.placeDrt = function() {
                    var drt = this.drt[this.drtc];
                    drt.x = this.x, drt.y = this.y, drt.time = 0, drt.put(), this.drtc = (this.drtc + 1) % this.drt.length, 
                    this.fuel -= 5;
                }, this.die = function(re) {
                    toast(re, "bad"), this.pel.classList.toggle("death", !0), this.stuntime = 15, setTimeout(this.brd.death.bind(this.brd), 4e3);
                };
            }
        }, tick = function(ft, t) {
            if (this.stuntime > 0) return this.stuntime -= ft, this.stuntime < 0 && (this.pel.classList.toggle("stun", !1), 
            this.pel.classList.toggle("start", !1)), !0;
            this.fuel -= ft, 10 == this.ty && this.fuel < 0 && this.die("Out of Fuel"), this.lpos += 3 * ft, 
            this.control(ft, t), this.lpos > 1 && (this.lpos -= 1, this.bx += xd(this.dir), 
            this.by += yd(this.dir), this.dir = this.brd.g.selDir(this.dp1, this.dp2, this.dir, this.bx, this.by)), 
            this.x = this.bx + this.lpos * xd(this.dir), this.y = this.by + this.lpos * yd(this.dir);
            var off = 0;
            if (this.lpos > .5) {
                var diff = ((this.brd.g.selDir(this.dp1, this.dp2, this.dir, this.bx + xd(this.dir), this.by + yd(this.dir)) - this.dir) % 4 + 4) % 4, eff = 2 * (this.lpos - .5);
                2 == diff ? off = 180 * eff : 1 == diff ? off = 90 * eff : 3 == diff && (off = -90 * eff);
            }
            return this.zrot = (90 * this.dir - 90 + off) % 360, !0;
        }, collision = function(e) {
            10 == this.ty && 11 == e.ty && this.stuntime < 0 && this.die("Destroyed by ICE");
        };
        break;

      case 15:
        depth = 1, cls = "lck", hudclr = "#D08", collision = function(e) {
            10 == e.ty && (this.x = -1, this.parent.unlock(), this.brd.incScore(100, "Lock Removed", "s1"), 
            this.put());
        };
        break;

      case 16:
        depth = 1, cls = "drt", tick = function(ft) {
            return this.time += ft, this.time > 5 && (this.x = this.y = -1, !0);
        }, collision = function(e) {
            this.time < .5 || 10 != e.ty && 11 != e.ty || e.stun();
        };
    }
    let bel = mkDiv("bent"), pel = mkDivT(cls + "_" + t, cls, depth);
    return bel.appendChild(pel), {
        el: bel,
        pel: pel,
        hudel: mkDivC(hudclr),
        ty: t,
        x: x,
        y: y,
        zrot: 0,
        put: function() {
            this.el.style.transform = "translate3d(" + this.x / grid_s * 600 + "vmin," + this.y / grid_s * 600 + "vmin,0) rotateZ(" + this.zrot + "deg)", 
            this.hudel && (this.hudel.style.transform = "translate3d(" + this.x / grid_s * 40 + "vmin," + this.y / grid_s * 40 + "vmin,0)");
        },
        init: init,
        tick: tick,
        collision: collision,
        reset: reset
    };
}

var grid_s = 50;

function mkGrid() {
    var _ew = new Array(grid_s * grid_s).fill(!1), _ns = new Array(grid_s * grid_s).fill(!1), _n = new Array(grid_s * grid_s).fill(0);
    return {
        getL: function(x, y, d) {
            return !(d < 0) && (d % 2 ? _ew[x + y * grid_s - (3 == d ? 1 : 0)] : _ns[x + (y - (0 == d ? 1 : 0)) * grid_s]);
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
        selDir: function(d1, d2, dc, x, y) {
            return this.getL(x, y, d1) ? d1 : this.getL(x, y, d2) ? d2 : this.getL(x, y, dc) ? dc : this.getL(x, y, (dc + 1) % 4) ? (dc + 1) % 4 : this.getL(x, y, (dc + 3) % 4) ? (dc + 3) % 4 : (dc + 2) % 4;
        },
        render: function(gs, end) {
            var width = 5, bs = 1 / grid_s, off = .4 * bs;
            gs.lineGrad("rgba(0,64,128,.05)", "rgba(0,128,225,.05)", "rgba(64,64,192,.05)", "rgba(0,0,128,.05)"), 
            asyncRepeat(() => {
                width *= .7, gs.lineWidth(width), width < .005 && gs.lineStyle("rgba(0,0,255,1)").lineWidth(.005), 
                gs.startCom();
                for (var x = 1; x < grid_s; x += 1) for (var y = 1; y < grid_s; y += 1) this.getL(x, y, 1) && gs.line(x * bs - .5 + off, y * bs - .5, (x + 1) * bs - .5 - off, y * bs - .5), 
                this.getL(x, y, 2) && gs.line(x * bs - .5, y * bs - .5 + off, x * bs - .5, (y + 1) * bs - .5 - off), 
                this.getL(x, y, 1) && this.getL(x, y, 3) && gs.line(x * bs - .5 - off, y * bs - .5, x * bs - .5 + off, y * bs - .5), 
                this.getL(x, y, 0) && this.getL(x, y, 2) && gs.line(x * bs - .5, y * bs - .5 - off, x * bs - .5, y * bs - .5 + off), 
                this.getL(x, y, 0) && this.getL(x, y, 1) && gs.circle(x * bs - .5 + off, y * bs - .5 - off, off, !1, 90, 180), 
                this.getL(x, y, 0) && this.getL(x, y, 3) && gs.circle(x * bs - .5 - off, y * bs - .5 - off, off, !1, 0, 90), 
                this.getL(x, y, 1) && this.getL(x, y, 2) && gs.circle(x * bs - .5 + off, y * bs - .5 + off, off, !1, 180, 270), 
                this.getL(x, y, 2) && this.getL(x, y, 3) && gs.circle(x * bs - .5 - off, y * bs - .5 + off, off, !1, 270, 360);
                return gs.strokeCom(), width >= .005;
            }, () => {
                this.renderTop(gs, end);
            });
        },
        renderTop: function(gs, end) {
            for (var bs = 1 / grid_s, off = bs / 2, x = 1; x < grid_s; x += 1) for (var y = 1; y < grid_s; y += 1) switch (this.getNode(x, y)) {
              case 1:
                break;

              case 2:
                gs.lineStyle("#FF0").lineWidth(.1), gs.circle(x * bs - .5 + off, y * bs - .5 + off, .8 * off);
                break;

              case 3:
                gs.lineStyle("#F00").lineWidth(.1), gs.circle(x * bs - .5 + off, y * bs - .5 + off, .8 * off);
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
    rect: function(x, y, x2, y2) {
        return this.hold || this.ctx.beginPath(), this.ctx.moveTo(x, y), this.ctx.rect(x, y, x2 - x, y2 - y), 
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
    snap: function() {
        let data = this.canvas.toDataURL();
        return function(el) {
            el.style.backgroundImage = "url(" + data + ")";
        };
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
    mkDecor(), mkBoard([ "2", "FFGGHH", "BCDBCD445566", "AABBCDEFGH3333" ]);
}

function toast(txt, cls) {
    var d = mkDiv("txt", cls);
    d.innerHTML = txt, ctl("top").appendChild(d), setTimeout(function() {
        d.remove();
    }, 4e3);
}

function ctl(id) {
    return document.getElementById(id);
}

function ctlcls(id, c) {
    ctl(id).classList.add(c);
}

function dist(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
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

function mkDiv(cls, cls2) {
    let d = document.createElement("div");
    return d.classList.add(cls), cls2 && d.classList.add(cls2), d;
}

function mkDivC(clr) {
    if (!clr) return null;
    let d = document.createElement("div");
    return d.style.backgroundColor = clr, d;
}

function mkDivT(cls, cls2, dep, dec) {
    let d = mkDiv(cls, cls2);
    if (dec || (dec = cls), dep > 0) {
        let l = mkDivT("l", null, dep - 1, dec);
        decorate(l, dec + "_" + dep + "l"), decorate(l, dec + "_" + dep), d.appendChild(l);
        let r = mkDivT("r", null, dep - 1, dec);
        decorate(r, dec + "_" + dep + "r"), decorate(r, dec + "_" + dep), d.appendChild(r);
    }
    return d;
}

function getEventPos(el, e) {
    var rect = el.getBoundingClientRect(), x = e.touches ? e.touches[0].clientX : e.clientX, y = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: (x - rect.left) / (rect.right - rect.left) - .5,
        y: (y - rect.top) / (rect.bottom - rect.top) - .5
    };
}

function xd(d) {
    return d % 2 ? 1 == d ? 1 : -1 : 0;
}

function yd(d) {
    return d % 2 ? 0 : 2 == d ? 1 : -1;
}
//# sourceMappingURL=scripts.js.map