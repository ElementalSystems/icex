function start()
{
  var g=mkGrid();
  var drawon=gs(grid_s*50);
  ctl('brd').appendChild(drawon.canvas);
  var width=1;
  drawon.lineStyle("#0F0").lineWidth(.25).line(-.4,-.4,.4,.4);
  drawon.lineGrad("rgba(0,128,64,.05)","rgba(0,255,128,.05)","rgba(64,192,64,.05)"
                   ,"rgba(0,128,0,.05)","rgba(0,128,64,.05)","rgba(64,128,64,.05)");
  asyncRepeat(
    () =>  {
       drawon.lineWidth(width).line(0,-.5,0,.5).line(0,0,.5,0).circle(.1,.1,.1).circle(.05,-.05,.05);
           width-=.08;
           return width>0; },
    () => { drawon.lineGrad("#F00","#00F","#0FF","#F00","#00F","#0FF").lineWidth(.25).line(.2,-.4,.3,.2); }
  );
  g.drawR(5,5,5,5);

}
