let decore = {};

function mkDecor() {
  decore = {
    'bike_10_1': gs().lineStyle("#FF8").lineWidth(15).line(-.3, -.4, .3, -.4).line(.3, -.4, -.3, .4).line(-.3, -.4, -.3, .4)
      .echo(8, 0, 0, 0, 0, 0, 0, 1, .1, .5, .2).snap(),
    'bike_10_2': gs().lineStyle("#FF0").fillStyle("rgba(255,255,0,.2)").lineWidth(2).circle(0, 0, .45, true)
      .echo(3, 0, 0, 0, 0, 0, 0, 1, .1, 1, .4).snap(),
    'bike_11_1': gs().lineStyle("#F44").lineWidth(15).line(-.4, -.4, .4, -.4).line(.4, -.4, -.4, .4).line(-.3, -.4, -.3, .4)
      .echo(8, 0, 0, 0, 0, 0, 0, 1, .01, .5, .2).snap(),
    'bike_11_2': gs().lineStyle("#F00").fillStyle("rgba(255,0,0,.2)").lineWidth(2).circle(0, 0, .45, true)
      .echo(3, 0, 0, 0, 0, 0, 0, 1, .1, 1, .4).snap(),
    'ent_4_1': gs().lineStyle("#80F").lineWidth(2).fillStyle("rgba(128,0,255,.5)").circle(0, 0, .4).circle(0, 0, .3,true).circle(0, 0, .2).snap(),
    'ent_4_2': gs().lineStyle("#20F").lineWidth(5).fillStyle("rgba(0,0,255,.5)").circle(0, 0, .4).circle(0, 0, .3,true).circle(0, 0, .2).snap(),
    'ent_5_1': gs(150).lineGrad("rgba(0,0,192,.5)","rgba(0,0,128,.5)","rgba(0,0,255,.5)").lineWidth(8).line(-.45, -.45, .45,.1).line(-.45, -.45, .45,.2).line(-.45, -.45, .45,.3).line(-.45, -.45, .45,.4).rotSym(3).snap(),
    'ent_5_2': gs().lineStyle("#88F").lineWidth(5).rect(-.3,-.3,.3,.3).snap(),
    'ent_5_3': gs().lineStyle("#008").lineWidth(8).rect(-.1,-.45,.1,.45).rect(-.45,-.1,.45,.1).snap(),
    'ent_6_1': gs().lineStyle("#0F0").lineWidth(2).rect(-.35,-.35,.35,.35).rect(-.25,-.25,.25,.25).rect(-.15,-.15,.15,.15).snap(),
    'ent_6_2': gs().lineStyle("rgba(0,255,0,.5)").lineWidth(12).rect(-.40,-.40,.40,.40).rect(-.15,-.15,.15,.15).snap(),
    'ent_6_3': gs().lineStyle("rgba(192,192,255,.8)").lineWidth(2).rect(-.45,-.45,.45,.45).rect(-.4,-.4,.4,.4).rect(-.35,-.35,.35,.35).snap(),

    'drt_16_1': gs().lineGrad("rgba(0,192,255,.3)","rgba(0,0,255,.6)").lineWidth(5).line(-.1,-.4,0,-.3).line(-.2,-.2,0,-.3).line(-.2,-.2,0,-.1)
      .echo(12, 0, 0, 0, 0, 0, 720, 1, .5, 1, 1).snap(),
  };

  //also decorate static peices
  gs(100).lineStyle("#0F0").lineWidth(4).line(.45, 0, .3, -.1).line(.45, 0, .3, .1)
    .echo(3, 0, 0, 0, 0, 0, 0, 1, .3, 1, .5)
    .echo(8, 0, 0, 0, 0, 0, 359, 1, 1, 1, 1)
    .setbg(ctl('dirctl'));
  decorate(ctl('drtctl'),'drt_16_1');
}

function decorate(el, cls) {
  if (decore[cls]) decore[cls](el);
}
