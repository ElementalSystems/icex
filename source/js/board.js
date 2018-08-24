function mkBoard(deck) {
  var drawon = gs(grid_s * 40);
  let bel = ctl('brd')
  bel.appendChild(drawon.canvas);
  var width = 1;

  var g = mkGrid();
  dealDeck(g, deck);

  let brd = {
    ents: [],
    inPlay: true,
    addEnt: function(e) {
      e.brd = brd;
      brd.ents.push(e);
      bel.appendChild(e.el);
      e.init();
      e.put();
    }
  }

  g.render(drawon, function() {
    drawon.setbg(bel);
    drawon.canvas.remove();
    ctlcls('brd', 'rdy');
    createNodeEnts();
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

  function gl(t) {
    let ft = .01;
    if (st) ft = (t - st) / 1000;
    if (ft > .1) ft = .1; //we don't believe in longer frames than 1/10 of a second.
    st = t;
    for (let i = 0; i < brd.ents.length; i += 1)
      if (brd.ents[i].tick(ft, t)) brd.ents[i].put();

    if (brd.trackEnt) { //track the main entity
      bel.style.transform = "translate3d(" + (70 - brd.trackEnt.x / grid_s * 600) + "vmin," + (50 - brd.trackEnt.y / grid_s * 600) + "vmin,0)";
    }
    if (brd.inPlay) requestAnimationFrame(gl);
  }

  return brd;
}
