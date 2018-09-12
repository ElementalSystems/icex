function info(title,text,buttext,butfunc)
{
  //set up the text
  ctl('mb_t').innerHTML=title;
  ctl('mb_i').innerHTML=text;
  ctl('mb_b1').innerHTML=buttext;
  ctl('mb_b1').onclick=function() {
    ctl('mb').classList.toggle('act',false);
    butfunc();
  };
  //class it in
  ctl('mb').classList.toggle('act',true);
}
