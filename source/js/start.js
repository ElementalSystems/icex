function start() {
  mkDecor();
  info("ICE-X",
    "Explore the network grid\n free the great minds\nand watch out for\ndefensive ICE agents.\n\n\n<small> a game by elementalsystems\nfor js13kgames.com</small>\n\n",
    "Play Now",
    function() { startGame(); });
}

function startGame()
{
  userscore = 0;
  userlives = 3;
  mkBoard(1);
}
