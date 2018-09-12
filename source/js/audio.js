

var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext=null;
if (!AudioContext) alert("no Audio Context");
else audioContext = new AudioContext;
var audio_mute = false;

function tone(length,type) {
  if ((!audioContext)||(audio_mute)) return { //a null note
    f:function() { return this; },
    v:function() { return this; } };
  var current= audioContext.currentTime;
  var oscillator = audioContext.createOscillator();
  var gain = audioContext.createGain();

  if (type) oscillator.type=type;
  oscillator.frequency.value=0;
  gain.gain.value=0;
  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start(0);
  oscillator.stop(current+length);

  return {
    f:function() {
      if (arguments.length==1) { oscillator.frequency.value=arguments[0]; return this; }
      for (var i=0;i<arguments.length;i+=1)
        oscillator.frequency.linearRampToValueAtTime(arguments[i],current+i/(arguments.length-1)*length);
      return this;
    },
    v:function() {
      if (arguments.length==1) { gain.gain.value=arguments[0]; return this; }
      for (var i=0;i<arguments.length;i+=1)
        gain.gain.linearRampToValueAtTime(arguments[i],current+i/(arguments.length-1)*length);
      return this;
    }
  };
}

var music_nf=[];

var ae={
  unlock: function() { tone(.33).f(420,440).v(.1,.3,.3,.3,.2,.1,0); },
  download: function() {tone(2).f(100,440).v(.1,.3,.1,.3,.1,.5,.6,0);},
  distort: function() {tone(.2,'triangle').f(200,220,200).v(.1,.3,0); tone(.2,'triangle').f(220,200,220).v(.3,.1,0);},
  discatch: function() {tone(1).f(150,220,150,250,150).v(.05,.1,.05,.1,.05,.1,.05,.1,0);},
  death: function() {tone(2).f(100,300,100,300).v(.3,.5,.1,0); tone(2).f(200,100,200,100).v(.1,.2,.5,0); },
  aifree: function() {tone(3).f(120,420).v(0,.3); tone(3).f(220,420).v(0,.3); tone(3).f(320,420).v(0,.3); },
  aigrow: function() {tone(1).f(100,200).v(0,.4,0,.4,0,.4,0,.4,0);},
  note: function(ni,l,f) {f=music_nf[ni%music_nf.length]*f;  tone(l*.333).f(f*.95,f,f).v(0,.1,.1,.05,.01,0);},
  wip: function(ni,l,f) {f=music_nf[ni%music_nf.length]*f;  tone(l*.333).f(f*.8,f,f,f*1.2).v(0,.1,0,.1,0);},
  beep: function(ni,l,f) {f=music_nf[ni%music_nf.length]*f;  tone(l*.333).f(f).v(0,.1,.1,.1,0);}
}
