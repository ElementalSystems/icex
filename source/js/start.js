function start() {
  var drawon = gs(grid_s * 100);
  ctl('brd').appendChild(drawon.canvas);
  var width = 1;

  var g = mkGrid();
  dealDeck(g, ["2DDDDD", "AAAABBBB","AAAABBBB344", "33444AABB","CDECDECDE" /*,"CDEABCDEA","BCDEABCDE","ABCDEABCDE"*/ ]);
  g.render(drawon,function()
  {
     drawon.setbg(ctl('brd'));
     drawon.canvas.remove();
     setTimeout(()=> ctlcls('brd','rdy'),3000);
  });

}
