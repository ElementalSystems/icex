var nms=["Ataraxia","Ilinx","Pronoia","Amae","Malneirophrenia","Euneirophrenia","Compathy","Basorexia","Hiraeth","Saudade"];
var nmsc=0;

function mkEnt(t, x, y) {
  let cls = 'ent';
  let depth = 1;
  let hudclr = null;
  let init = function() {};
  let tick = function() {
    return false;
  };
  let collision = function() {};
  let reset = function() {};

  switch (t) {
    case 2: //player start position
    case 3: //enemy start base
      init = function() {
        this.brd.addEnt(mkEnt(t + 8, this.x, this.y));
      }
      break;
    case 4: //ai
    case 5:
    case 6:
    case 7:
      depth = 3;
      init = function() //place four locks
      {
        let self = this;

        function mkLock(x, y) {
          let e = mkEnt(15, self.x + x, self.y + y);
          e.parent = self;
          return e;
        }
        this.lcks = 4;
        this.lcksdead = 0;
        this.nme=nms[nmsc];
        nmsc=(nmsc+1)%nms.length;

        this.unlock = function() {
          self.lcksdead += 1;
          self.sizeMe();
          this.brd.incScore(100 * this.lcksdead, "Program subsystems online", "s2");
          if (this.lcks == this.lcksdead) {
            this.brd.incScore(1000, this.nme+" Liberated", "s3");
            this.brd.incScore(Math.round(this.brd.trackEnt.fuel * 10), "Fuel Bonus", "s4");
            this.brd.aifree();
            this.el.classList.add("full")
            //gifts
            switch (this.ty) {
              case 4:
                for (let i = 0; i < this.brd.ents.length; i += 1)
                  if (this.brd.ents[i].ty == 11) this.brd.ents[i].stun(10);
                toast(this.nme+"'s Gift: Enemies Disoriented 10s", "good");
                break;
              case 5:
                this.brd.trackEnt.fuel += 50;
                if (this.brd.trackEnt.fuel > 100) this.brd.trackEnt.fuel = 100;
                toast(this.nme+"'s Gift: +50 Fuel", "good");
                break;
              case 6:
                this.brd.trackEnt.fastTime = 20;
                toast(this.nme+"'s Gift: Speed Boost 20s", "good");
                break;
              case 7:
                this.brd.incLv(1);
                toast(this.nme+"'s Gift: Extra Life", "good");
                break;

            }
            ae.aifree();
          } else {
            ae.aigrow();
          }
        }
        this.sizeMe = function() {
          let sc = .2 + (this.lcksdead) * .4;
          this.pel.style.transform = "scale3d(" + sc + "," + sc + "," + sc + ")";
        }
        this.sizeMe();

        this.brd.addEnt(mkLock(.5, -2));
        this.brd.addEnt(mkLock(.5, 3));
        this.brd.addEnt(mkLock(-2, .5));
        this.brd.addEnt(mkLock(3, .5));
        this.brd.aileft += 1;
      }

      break;

    case 10: //player Bike
    case 11: //enemy bike
      depth = 2;
      cls = 'bike';
      hudclr = ((t == 10) ? "#FF0" : "#F00");
      reset = function() {
        this.x = this.bx = x;
        this.y = this.by = y;
        this.dir = 1;
        this.dp1 = -1;
        this.dp2 = -1;
        this.lpos = 0;
        this.stuntime = ((this.ty == 10) ? 2 : 5);
        this.fuel = 100;
        this.fastTime = 0;
        this.pel.classList.toggle('start', true);
        this.pel.classList.toggle('stun', false);
        this.pel.classList.toggle('death', false);
        this.started = false;
      }
      init = function() {
        if (t == 10) this.brd.trackEnt = this;
        this.control = ((t == 10) ? userController : mkAiCtl(this.brd));
        this.stun = function(tm) {
          if (!tm) tm = 1;
          if (this.stuntime > 0) return; //already stunned
          this.pel.classList.toggle('stun', true);
          this.stuntime = tm;
          ae.discatch();
        }
        this.stuntime = -1;
        if (t==11) this.brd.defcount += 1;
        if (t == 10) { //player needs distorts
          this.drtc = 0;
          this.drt = [];
          for (var i = 0; i < 10; i += 1) {
            let x = mkEnt(16, -1, -1);
            this.drt.push(x);
            this.brd.addEnt(x)
          }
          this.placeDrt = function() {
            var drt = this.drt[this.drtc];
            drt.x = this.x;
            drt.y = this.y;
            drt.time = 0;
            drt.put();
            this.drtc = (this.drtc + 1) % this.drt.length;
            this.fuel -= 5;
            ae.distort();
          }
          this.die = function(re) {
            toast(re, "bad")
            ae.death();
            this.pel.classList.toggle('death', true);
            this.stuntime = 15;
            setTimeout(this.brd.death.bind(this.brd), 4000);
          }
        }
      };
      tick = function(ft, t) {
        if (!this.started) {
          if (this.ty == 10) {
            toast("downloading...", "s3");
            ae.download();
          }
          this.started = true;
        }
        if (this.stuntime > 0) {
          this.stuntime -= ft;
          if (this.stuntime < 0) {
            this.pel.classList.toggle('stun', false);
            this.pel.classList.toggle('start', false);
          }
          return true;
        }
        this.fuel -= ft;
        this.fastTime -= ft;
        if ((this.ty == 10) && (this.fuel < 0)) this.die("Out of Fuel");
        if (this.fastTime > 0) this.lpos += (ft * 4);
        else this.lpos += (ft * 3);
        this.control(ft, t);
        if (this.lpos > 1) { //the end of the segment
          this.lpos -= 1;
          //move us on the next hex; we have reached the end
          this.bx += xd(this.dir);
          this.by += yd(this.dir);
          //now we choose a direction based on what is available
          this.dir = this.brd.g.selDir(this.dp1, this.dp2, this.dir, this.bx, this.by);
          if (this.ty == 10) { //player bike makes music
            var n = this.bx + this.by;
            var l = 1;
            if (!(this.bx % 4)) l = 2;
            if (!(this.by % 8)) l = 4;
            this.brd.lev.note(n, .3 * l, 1);
            if (!((this.bx + 2) % 4)) this.brd.lev.note(n, .3 * l, 2);
            if (!((this.by + 1) % 4)) this.brd.lev.note(n, .3 * l, .5);


          }
        }
        //set our position
        this.x = this.bx + this.lpos * xd(this.dir);
        this.y = this.by + this.lpos * yd(this.dir);
        var off = 0;
        if (this.lpos > .5) { //do we need to steer
          var newDir = this.brd.g.selDir(this.dp1, this.dp2, this.dir, this.bx + xd(this.dir), this.by + yd(this.dir));
          //compare this to our current
          var diff = ((newDir - this.dir) % 4 + 4) % 4;
          var eff = (this.lpos - .5) * 2;
          if (diff == 2) off = 180 * eff;
          else if (diff == 1) off = 90 * eff;
          else if (diff == 3) off = -90 * eff
        }
        this.zrot = (-90 + this.dir * 90 + off) % 360;
        return true;
      }
      collision = function(e) {
        if ((this.ty == 10) && (e.ty == 11) && (this.stuntime < 0)) //user hits a enemy bike
          this.die("Destroyed by ICE");


      }
      break;
    case 15: //data lock
      depth = 1;
      cls = 'lck';
      hudclr = "#D08";
      collision = function(e) {
        if (e.ty != 10) return;
        ae.unlock();
        this.x = -1;
        this.el.style.display='none';
        this.hudel.style.display='none';
        this.parent.unlock();
        this.brd.incScore(100, "Lock Removed", "s1");
        this.put();
      };
      break;
    case 16: //distort
      depth = 1;
      cls = 'drt';
      tick = function(ft) {
        this.time += ft;
        if (this.time > 5) {
          this.x = this.y = -1;
          return true;
        }
        return false;
      }
      collision = function(e) {
        if (this.time < .5) return; //we are not alive yet;
        if ((e.ty == 10) || (e.ty == 11)) e.stun(); //stun a car that hits us
      }

      break;
  }

  let bel = mkDiv('bent');
  let pel = mkDivT(cls + '_' + t, cls, depth);
  bel.appendChild(pel);
  let e = {
    el: bel,
    pel: pel,
    hudel: mkDivC(hudclr),
    ty: t,
    x: x,
    y: y,
    zrot: 0,
    put: function() {
      this.el.style.transform = "translate3d(" + (this.x / grid_s * 600) + "vmin," + (this.y / grid_s * 600) + "vmin,0) rotateZ(" + this.zrot + "deg)";
      if (this.hudel)
        this.hudel.style.transform = "translate3d(" + (this.x / grid_s * 40) + "vmin," + (this.y / grid_s * 40) + "vmin,0)";

    },
    init: init,
    tick: tick,
    collision: collision,
    reset: reset
  }
  return e;
}
