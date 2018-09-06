function mkBoard(deck) {
  var drawon = gs(grid_s * 40);
  let bel = ctl('brd');
  let hel = ctl('hud');
  let dpel = ctl('dirctl');
  let drtel = ctl('drtctl');
  let lvctl=ctl('lvctl');
  let fctl=ctl('fctl');
  let scel = ctl('scctl');
  let topel=ctl('top');
  bel.appendChild(drawon.canvas);
  var width = 1;
  var scmod=0;

  var g = mkGrid();
  dealDeck(g, deck);

  let brd = {
    ents: [],
    inPlay: true,
    addEnt: function(e) {
      e.brd = brd;
      brd.ents.push(e);
      bel.appendChild(e.el);
      if (e.hudel) hel.appendChild(e.hudel);
      e.init();
      e.reset();
      e.put();
    },
    score: 0,
    lives: 3,
    incScore: function(inc,txt,cls) {
      brd.score+=inc;
      scel.innerText=brd.score;
      if (txt) {
         toast("<b>+"+inc+"</b> "+txt,cls);
      }
    },
    incLv: function(inc) {
      brd.lives+=inc;
      lvctl.innerText=brd.lives;
    },
    death: function()
    {
      this.incLv(-1);
      //reset everyone
      for (let i=0;i<this.ents.length; i+=1)
         this.ents[i].reset();
    },
    g: g
  }
  toast("...Designing Level...","bad")
  g.render(drawon, function() {
    drawon.setbg(bel);
    drawon.canvas.remove();
    ctlcls('brd', 'rdy');
    createNodeEnts();
    attachKb(bel);
    attachDp(dpel,drtel);
    startGl();
  });

  function createNodeEnts() {
    for (let i = 0; i < grid_s; i += 1)
      for (let j = 0; j < grid_s; j += 1) {
        let v = g.getNode(i, j);
        if (v && (v != 1)) brd.addEnt(mkEnt(v, i, j));
      }
  }

  function startGl() {
    requestAnimationFrame(gl);
  }

  let st = 0;

  function checkCollision(e1,e2)
  {
      if (dist(e1,e2)>.5) return;
      e1.collision(e2);
      e2.collision(e1);
  }

  function gl(t) {
    let ft = .01;
    if (st) ft = (t - st) / 1000;
    if (ft > .1) ft = .1; //we don't believe in longer frames than 1/10 of a second.
    st = t;
    //do the ticks for each object
    for (let i = 0; i < brd.ents.length; i += 1)
      if (brd.ents[i].tick(ft, t)) brd.ents[i].put();

    //check for collisions between objects
    for (let i = 0; i < brd.ents.length; i += 1)
       for (let j = i; j < brd.ents.length; j += 1)
          checkCollision(brd.ents[i],brd.ents[j]);


    if (brd.trackEnt) { //track the main entity
      fctl.innerText=Math.floor(brd.trackEnt.fuel);
      bel.style.transform = "translate3d(" + (70 - brd.trackEnt.x / grid_s * 600) + "vmin," + (50 - brd.trackEnt.y / grid_s * 600) + "vmin,0)";
    }
    if (brd.inPlay) requestAnimationFrame(gl);
  }
  brd.incScore(0);
  brd.incLv(0);
  return brd;
}
