function toast(txt,cls)
{
  //create a div;
  var d=mkDiv('txt',cls);
  d.innerHTML=txt;
  ctl('top').appendChild(d);
  //make the kill funtion
  setTimeout(function() {d.remove()},4000);
}
