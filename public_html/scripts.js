var AudioContext = window.AudioContext || window.webkitAudioContext, audioContext = null;

AudioContext ? audioContext = new AudioContext() : alert("no Audio Context");

var audio_mute = !1;

function tone(length, type) {
    if (!audioContext || audio_mute) return {
        f: function() {
            return this;
        },
        v: function() {
            return this;
        }
    };
    var current = audioContext.currentTime, oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
    return type && (oscillator.type = type), oscillator.frequency.value = 0, gain.gain.value = 0, 
    oscillator.connect(gain), gain.connect(audioContext.destination), oscillator.start(0), 
    oscillator.stop(current + length), {
        f: function() {
            if (1 == arguments.length) return oscillator.frequency.value = arguments[0], this;
            for (var i = 0; i < arguments.length; i += 1) oscillator.frequency.linearRampToValueAtTime(arguments[i], current + i / (arguments.length - 1) * length);
            return this;
        },
        v: function() {
            if (1 == arguments.length) return gain.gain.value = arguments[0], this;
            for (var i = 0; i < arguments.length; i += 1) gain.gain.linearRampToValueAtTime(arguments[i], current + i / (arguments.length - 1) * length);
            return this;
        }
    };
}

var music_nf = [], ae = {
    unlock: function() {
        tone(.33).f(420, 440).v(.1, .3, .3, .3, .2, .1, 0);
    },
    download: function() {
        tone(2).f(100, 440).v(.1, .3, .1, .3, .1, .5, .6, 0);
    },
    distort: function() {
        tone(.2, "triangle").f(200, 220, 200).v(.1, .3, 0), tone(.2, "triangle").f(220, 200, 220).v(.3, .1, 0);
    },
    discatch: function() {
        tone(1).f(150, 220, 150, 250, 150).v(.05, .1, .05, .1, .05, .1, .05, .1, 0);
    },
    death: function() {
        tone(2).f(100, 300, 100, 300).v(.3, .5, .1, 0), tone(2).f(200, 100, 200, 100).v(.1, .2, .5, 0);
    },
    aifree: function() {
        tone(3).f(120, 420).v(0, .3), tone(3).f(220, 420).v(0, .3), tone(3).f(320, 420).v(0, .3);
    },
    aigrow: function() {
        tone(1).f(100, 200).v(0, .4, 0, .4, 0, .4, 0, .4, 0);
    },
    note: function(ni, l, f) {
        f = music_nf[ni % music_nf.length] * f, tone(.333 * l).f(.95 * f, f, f).v(0, .1, .1, .05, .01, 0);
    },
    wip: function(ni, l, f) {
        f = music_nf[ni % music_nf.length] * f, tone(.333 * l).f(.8 * f, f, f, 1.2 * f).v(0, .1, 0, .1, 0);
    },
    beep: function(ni, l, f) {
        f = music_nf[ni % music_nf.length] * f, tone(.333 * l).f(f).v(0, .1, .1, .1, 0);
    }
};

function mkBoard(l) {
    var deck = lev(l).deck, drawon = gs(40 * grid_s);
    let bel = ctl("brd"), hel = ctl("hud"), dpel = ctl("dirctl"), drtel = ctl("drtctl"), lvctl = ctl("lvctl"), fctl = ctl("fctl"), scel = ctl("scctl"), topel = ctl("top");
    bel.appendChild(drawon.canvas);
    var g = mkGrid();
    dealDeck(g, deck);
    let brd = {
        ents: [],
        lev: lev(l),
        levid: l,
        inPlay: !0,
        aileft: 0,
        defcount: 0,
        addEnt: function(e) {
            e.brd = brd, brd.ents.push(e), bel.appendChild(e.el), e.hudel && hel.appendChild(e.hudel), 
            e.init(), e.reset(), e.put();
        },
        aifree: function() {
            this.aileft -= 1, 0 == this.aileft && (this.inPlay = !1, setTimeout(function() {
                brd.incScore(3e3, "Level Completed", "s3"), setTimeout(function() {
                    info("Level " + brd.levid + " Complete", "Your score " + userscore, "Next Level", function() {
                        mkBoard(brd.levid + 1);
                    });
                }, 1500);
            }, 500));
        },
        incScore: function(inc, txt, cls) {
            userscore += inc, scel.innerText = userscore, txt && toast("<b>+" + inc + "</b> " + txt, cls);
        },
        incLv: function(inc) {
            userlives += inc, lvctl.innerText = userlives;
        },
        death: function() {
            if (this.incLv(-1), 0 == userlives) setTimeout(function() {
                info("Game Over", "Your Final Score " + userscore, "Restart", function() {
                    startGame();
                });
            }, 1e3), brd.inPlay = !1; else for (let i = 0; i < this.ents.length; i += 1) this.ents[i].reset();
        },
        g: g
    };
    topel.style.backgroundColor = brd.lev.bk, music_nf = brd.lev.key, g.render(drawon, brd.lev.grid, function() {
        drawon.setbg(bel), drawon.canvas.remove(), bel.innerHTML = "", hel.innerHTML = "", 
        ctlcls("brd", "rdy"), function() {
            for (let i = 0; i < grid_s; i += 1) for (let j = 0; j < grid_s; j += 1) {
                let v = g.getNode(i, j);
                v && 1 != v && brd.addEnt(mkEnt(v, i, j));
            }
        }(), attachKb(bel), attachDp(dpel, drtel), info("Level " + brd.levid, "<h5>Objective:  Remove the " + 4 * brd.aileft + " pink locks.\nCaptives:   " + brd.aileft + " great minds.\nDefenses:   " + brd.defcount + " ICE units.\nTopography: " + brd.lev.desc + "</h5>\n\n<small>" + brd.lev.inst + "</small>", "Start", function() {
            requestAnimationFrame(gl);
        }), track();
    });
    let st = 0;
    function track() {
        brd.trackEnt && (fctl.innerText = Math.floor(brd.trackEnt.fuel), bel.style.transform = "translate3d(" + (70 - brd.trackEnt.x / grid_s * 600) + "vmin," + (50 - brd.trackEnt.y / grid_s * 600) + "vmin,0)", 
        bel.focus());
    }
    function gl(t) {
        let ft = .01;
        st && (ft = (t - st) / 1e3), ft > .1 && (ft = .1), st = t;
        for (let i = 0; i < brd.ents.length; i += 1) brd.ents[i].tick(ft, t) && brd.ents[i].put();
        for (let i = 0; i < brd.ents.length; i += 1) for (let j = i; j < brd.ents.length; j += 1) e1 = brd.ents[i], 
        e2 = brd.ents[j], dist(e1, e2) > .5 || (e1.collision(e2), e2.collision(e1));
        var e1, e2;
        track(), brd.inPlay && requestAnimationFrame(gl);
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
    I: cRect(1, 1),
    2: bGen(2, 3, !0),
    3: bGen(3, 3, !0),
    4: bGen(4, 7, !1, !0),
    5: bGen(5, 7, !1, !0),
    6: bGen(6, 7, !1, !0),
    7: bGen(7, 7, !1, !0)
};

function dealDeck(grd, dckL) {
    for (var xp = rdmI(5, grid_s / 2 - 5), yp = rdmI(5, grid_s / 2 - 5), wp = 1, hp = 1, err = 0, rX = !1, rY = !1, j = 0; j < dckL.length; j += 1) for (var dck = dckL[j]; dck.length; ) {
        var i = rdmI(0, dck.length - 1), cd = cards[dck.charAt(i)], x = 0, y = 0;
        rdmI(0, 1) ? (x = xp + (rX ? 0 : wp), y = rdmI(yp, yp + hp - 1)) : (x = rdmI(xp, xp + wp - 1), 
        y = yp + (rY ? 0 : hp)), rdmI(0, 5) || (rX = !rX), rdmI(0, 5) || (rY = !rY);
        x = x - (rX ? cd.w : 0), y = y - (rY ? cd.h : 0);
        (err += 1) > 5 && (err = 0, dck += "GH"), x <= 0 || x + cd.w >= grid_s ? rX = !rX : y <= 0 || y + cd.h >= grid_s ? rY = !rY : cd.chk(grd, x, y) && (err = 0, 
        cd.drw(grd, x, y), dck = remC(dck, i), xp = x, yp = y, wp = cd.w, hp = cd.h);
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
    this.dp1 = -1, this.dp2 = -1, _drtt -= ft, (_pressed[38] || _pressed[87]) && (this.dp1 = 0), 
    (_pressed[40] || _pressed[83]) && (this.dp1 = 2), (_pressed[37] || _pressed[65]) && (this.dp2 = 3), 
    (_pressed[39] || _pressed[68]) && (this.dp2 = 1), this.dp1 < 0 && this.dp2 < 0 ? (_lastT.x > -1 && _lastT.x < 1 && (_lastT.x > .2 && (this.dp1 = 1), 
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
        if (time -= ft, max = 1, time < 0) {
            let xdf = brd.trackEnt.x - this.x, ydf = brd.trackEnt.y - this.y, dist = Math.abs(xdf) + Math.abs(ydf);
            if (dist > 15 && !rdmI(0, 9) ? (xdf *= -1, ydf *= -1, max = 3) : dist > 5 && !rdmI(0, 4) && (xdf += 10 * xd(brd.trackEnt.dir), 
            ydf += 10 * yd(brd.trackEnt.dir)), this.dp1 = xdf > 0 ? 1 : 3, this.dp2 = ydf > 0 ? 2 : 0, 
            Math.abs(ydf) > Math.abs(xdf)) {
                t = this.dp1;
                this.dp1 = this.dp2, this.dp2 = t;
            }
            time = rdm(.25, max);
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
        ent_7_3: gs().lineStyle("#840").lineWidth(10).line(-.5, -.5, .5, 0).line(-.5, -.5, 0, .5).snap(),
        ent_7_2: gs().lineStyle("#AA0").lineWidth(6).line(-.5, -.5, .5, 0).line(-.5, -.5, 0, .5).snap(),
        ent_7_1: gs(100).lineStyle("#FF0").lineWidth(6).line(-.5, -.5, .5, 0).line(-.5, -.5, 0, .5).echo(8, 0, 0, 0, 0, -45, 45, 1, 1, .5, .2).snap(),
        drt_16_1: gs().lineGrad("rgba(0,192,255,.3)", "rgba(0,0,255,.6)").lineWidth(5).line(-.1, -.4, 0, -.3).line(-.2, -.2, 0, -.3).line(-.2, -.2, 0, -.1).echo(12, 0, 0, 0, 0, 0, 720, 1, .5, 1, 1).snap()
    }, gs(100).lineStyle("#0F0").lineWidth(4).line(.45, 0, .3, -.1).line(.45, 0, .3, .1).echo(3, 0, 0, 0, 0, 0, 0, 1, .3, 1, .5).echo(8, 0, 0, 0, 0, 0, 359, 1, 1, 1, 1).setbg(ctl("dirctl")), 
    decorate(ctl("drtctl"), "drt_16_1");
}

function decorate(el, cls) {
    decore[cls] && decore[cls](el);
}

var nms = [ "Ataraxia", "Ilinx", "Pronoia", "Amae", "Malneirophrenia", "Euneirophrenia", "Compathy", "Basorexia", "Hiraeth", "Saudade" ], nmsc = 0;

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
      case 7:
        depth = 3, init = function() {
            let self = this;
            function mkLock(x, y) {
                let e = mkEnt(15, self.x + x, self.y + y);
                return e.parent = self, e;
            }
            this.lcks = 4, this.lcksdead = 0, this.nme = nms[nmsc], nmsc = (nmsc + 1) % nms.length, 
            this.unlock = function() {
                if (self.lcksdead += 1, self.sizeMe(), this.brd.incScore(100 * this.lcksdead, "Program subsystems online", "s2"), 
                this.lcks == this.lcksdead) {
                    switch (this.brd.incScore(1e3, this.nme + " Liberated", "s3"), this.brd.incScore(Math.round(10 * this.brd.trackEnt.fuel), "Fuel Bonus", "s4"), 
                    this.brd.aifree(), this.el.classList.add("full"), this.ty) {
                      case 4:
                        for (let i = 0; i < this.brd.ents.length; i += 1) 11 == this.brd.ents[i].ty && this.brd.ents[i].stun(10);
                        toast(this.nme + "'s Gift: Enemies Disoriented 10s", "good");
                        break;

                      case 5:
                        this.brd.trackEnt.fuel += 50, this.brd.trackEnt.fuel > 100 && (this.brd.trackEnt.fuel = 100), 
                        toast(this.nme + "'s Gift: +50 Fuel", "good");
                        break;

                      case 6:
                        this.brd.trackEnt.fastTime = 20, toast(this.nme + "'s Gift: Speed Boost 20s", "good");
                        break;

                      case 7:
                        this.brd.incLv(1), toast(this.nme + "'s Gift: Extra Life", "good");
                    }
                    ae.aifree();
                } else ae.aigrow();
            }, this.sizeMe = function() {
                let sc = .2 + .4 * this.lcksdead;
                this.pel.style.transform = "scale3d(" + sc + "," + sc + "," + sc + ")";
            }, this.sizeMe(), this.brd.addEnt(mkLock(.5, -2)), this.brd.addEnt(mkLock(.5, 3)), 
            this.brd.addEnt(mkLock(-2, .5)), this.brd.addEnt(mkLock(3, .5)), this.brd.aileft += 1;
        };
        break;

      case 10:
      case 11:
        depth = 2, cls = "bike", hudclr = 10 == t ? "#FF0" : "#F00", reset = function() {
            this.x = this.bx = x, this.y = this.by = y, this.dir = 1, this.dp1 = -1, this.dp2 = -1, 
            this.lpos = 0, this.stuntime = 10 == this.ty ? 2 : 5, this.fuel = 100, this.fastTime = 0, 
            this.pel.classList.toggle("start", !0), this.pel.classList.toggle("stun", !1), this.pel.classList.toggle("death", !1), 
            this.started = !1;
        }, init = function() {
            if (10 == t && (this.brd.trackEnt = this), this.control = 10 == t ? userController : mkAiCtl(this.brd), 
            this.stun = function(tm) {
                tm || (tm = 1), this.stuntime > 0 || (this.pel.classList.toggle("stun", !0), this.stuntime = tm, 
                ae.discatch());
            }, this.stuntime = -1, 11 == t && (this.brd.defcount += 1), 10 == t) {
                this.drtc = 0, this.drt = [];
                for (var i = 0; i < 10; i += 1) {
                    let x = mkEnt(16, -1, -1);
                    this.drt.push(x), this.brd.addEnt(x);
                }
                this.placeDrt = function() {
                    var drt = this.drt[this.drtc];
                    drt.x = this.x, drt.y = this.y, drt.time = 0, drt.put(), this.drtc = (this.drtc + 1) % this.drt.length, 
                    this.fuel -= 5, ae.distort();
                }, this.die = function(re) {
                    toast(re, "bad"), ae.death(), this.pel.classList.toggle("death", !0), this.stuntime = 15, 
                    setTimeout(this.brd.death.bind(this.brd), 4e3);
                };
            }
        }, tick = function(ft, t) {
            if (this.started || (10 == this.ty && (toast("downloading...", "s3"), ae.download()), 
            this.started = !0), this.stuntime > 0) return this.stuntime -= ft, this.stuntime < 0 && (this.pel.classList.toggle("stun", !1), 
            this.pel.classList.toggle("start", !1)), !0;
            if (this.fuel -= ft, this.fastTime -= ft, 10 == this.ty && this.fuel < 0 && this.die("Out of Fuel"), 
            this.fastTime > 0 ? this.lpos += 4 * ft : this.lpos += 3 * ft, this.control(ft, t), 
            this.lpos > 1 && (this.lpos -= 1, this.bx += xd(this.dir), this.by += yd(this.dir), 
            this.dir = this.brd.g.selDir(this.dp1, this.dp2, this.dir, this.bx, this.by), 10 == this.ty)) {
                var n = this.bx + this.by, l = 1;
                this.bx % 4 || (l = 2), this.by % 8 || (l = 4), this.brd.lev.note(n, .3 * l, 1), 
                (this.bx + 2) % 4 || this.brd.lev.note(n, .3 * l, 2), (this.by + 1) % 4 || this.brd.lev.note(n, .3 * l, .5);
            }
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
            10 == e.ty && (ae.unlock(), this.x = -1, this.el.style.display = "none", this.hudel.style.display = "none", 
            this.parent.unlock(), this.brd.incScore(100, "Lock Removed", "s1"), this.put());
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
        render: function(gs, cols, end) {
            var width = 5, bs = 1 / grid_s, off = .4 * bs;
            gs.lineGradA(cols), asyncRepeat(() => {
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
    lineGradA: function(a) {
        return this.ctx.strokeStyle = cgrad(this.ctx, .5, a), this;
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

function info(title, text, buttext, butfunc) {
    ctl("mb_t").innerHTML = title, ctl("mb_i").innerHTML = text, ctl("mb_b1").innerHTML = buttext, 
    ctl("mb_b1").onclick = function() {
        ctl("mb").classList.toggle("act", !1), butfunc();
    }, ctl("mb").classList.toggle("act", !0);
}

function lev(i) {
    switch (i) {
      case 1:
        return {
            deck: [ "2", "DEEFFF", "EFEF3", "EEFFF44" ],
            note: ae.note,
            key: [ 261, 329, 349, 261, 195, 391, 261, 195 ],
            grid: [ "rgba(0,64,255,.1)", "rgba(0,255,64,.1)", "rgba(0,64,255,.1)", "rgba(0,255,64,.1)", "rgba(0,64,255,.1)", "rgba(0,255,64,.1)" ],
            bk: "#000",
            desc: "Local Sprawl",
            inst: "Use the <b>&lt;Arrows&gt;</b> or the green pad to steer.\nUse the HUD to locate pink data locks.\n<b>&lt;Space&gt;</b> or the blue button leaves \nnetwork noise to trap units.\n\n"
        };

      case 2:
        return {
            deck: [ "2", "DDDEEFGH", "ABCABC545", "ABCDEFGH33" ],
            note: ae.note,
            key: [ 261, 329, 349, 261, 195, 391, 261, 195 ],
            grid: [ "rgba(255,255,255,.1)", "rgba(255,255,0,.1)", "rgba(255,255,255,.1)", "rgba(255,255,0,.1)", "rgba(255,255,255,.1)", "rgba(255,255,0,.1)" ],
            bk: "#000",
            desc: "Urban",
            inst: "Use <b>&lt;Space&gt;</b> or the blue button to leave\n network noise and trap a pursuer\n\nBut beware it uses lot of fuel."
        };

      case 3:
        return {
            deck: [ "2", "DEDEDEDEDE5556", "ABC3ABC3ABC3ABC" ],
            note: ae.note,
            key: [ 466, 554, 369, 329, 493, 369, 466, 329 ],
            grid: [ "rgba(0,64,255,.05)", "rgba(0,64,255,.05)", "rgba(0,128,255,.05)", "rgba(64,64,255,.05)", "rgba(0,0,255,.05)" ],
            bk: "#004",
            desc: "Spawling",
            inst: "Each great mind gives a distinct \nadvantage when freed."
        };

      case 4:
        return {
            deck: [ "233333IIIBBCCEE", "EEEEEDDDDD", "GHGHGHIIIIIIIII7" ],
            note: ae.wip,
            key: [ 277, 138, 155, 195, 261, 261, 233, 277 ],
            grid: [ "rgba(0,0,64,.1)", "rgba(0,64,0,.1)", "rgba(0,64,64,.1)" ],
            bk: "#8A8",
            desc: "Rich/Dense",
            inst: "You can gain extra lives \nby freeing the minds."
        };

      case 5:
        return {
            deck: [ "2GHIIIIIGH33", "EFIEFII", "GHGHGHIIIII456" ],
            note: ae.wip,
            key: [ 277, 138, 155, 195, 261, 261, 233, 277 ],
            grid: [ "rgba(0,0,64,.1)", "rgba(0,64,0,.1)", "rgba(0,64,64,.1)" ],
            bk: "#FCC",
            desc: "Limbs",
            inst: ""
        };

      case 6:
        return {
            deck: [ "2IIFF", "GHGG3333", "ABCABCFFFF4567" ],
            note: ae.note,
            key: [ 277, 138, 155, 195, 261, 261, 233, 277 ],
            grid: [ "rgba(255,64,64,.05)", "rgba(192,0,0,.05)", "rgba(255,0,0,.05)", "rgba(192,0,0,.05)", "rgba(255,64,64,.05)" ],
            bk: "#000",
            desc: "Dense",
            inst: ""
        };

      case 7:
        return {
            deck: [ "2GHGH", "DEDEDEDEDE4567", "ABC3ABC3ABC3ABCABC3ABC3ABC3ABCIIII" ],
            note: ae.note,
            key: [ 277, 138, 155, 195, 261, 261, 233, 277 ],
            grid: [ "rgba(0,64,128,.05)", "rgba(0,255,128,.05)", "rgba(0,128,225,.05)", "rgba(64,255,64,.05)", "rgba(64,64,192,.05)", "rgba(0,0,128,.05)" ],
            bk: "#000",
            desc: "Ultra-dense",
            inst: ""
        };

      case 8:
        return {
            deck: [ "2IIIIIIII", "ABCIIIIGHGH", "GHGHGHGHG444567333333" ],
            note: ae.wip,
            key: [ 277, 138, 155, 195, 261, 261, 233, 277 ],
            grid: [ "rgba(255,255,255,.1)", "rgba(255,255,0,.1)", "rgba(255,255,255,.1)", "rgba(255,255,0,.1)", "rgba(255,255,255,.1)", "rgba(255,255,0,.1)" ],
            bk: "#500",
            desc: "contained"
        };
    }
}

function start() {
    mkDecor(), info("ICE-X", "Explore the network grid\n free the great minds\nand watch out for\ndefensive ICE agents.\n\n\n<small> a game by elementalsystems\nfor js13kgames.com</small>\n\n", "Play Now", function() {
        startGame();
    });
}

function startGame() {
    userscore = 0, userlives = 3, mkBoard(1);
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