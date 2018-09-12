function lev(i) {
  switch (i) {
    case 1:
      return {
        deck: ["2", "DEEFFF", "EFEF3", "EEFFF44"],
        note: ae.note,
        key: [261, 329, 349, 261, 195, 391, 261, 195],
        grid: ["rgba(0,64,255,.1)", "rgba(0,255,64,.1)", "rgba(0,64,255,.1)", "rgba(0,255,64,.1)", "rgba(0,64,255,.1)", "rgba(0,255,64,.1)"],
        bk: "#000",
        desc: "Local Sprawl",
        inst: "Use the <b>&lt;Arrows&gt;</b> or the green pad to steer.\nUse the HUD to locate pink data locks.\n<b>&lt;Space&gt;</b> or the blue button leaves \nnetwork noise to trap units.\n\n"
      };
    case 2:
      return {
        deck: ["2", "DDDEEFGH", "ABCABC545", "ABCDEFGH33"],
        note: ae.note,
        key: [261, 329, 349, 261, 195, 391, 261, 195],
        grid: ["rgba(255,255,255,.1)", "rgba(255,255,0,.1)", "rgba(255,255,255,.1)", "rgba(255,255,0,.1)", "rgba(255,255,255,.1)", "rgba(255,255,0,.1)"],
        bk: "#000",
        desc: "Urban",
        inst: "Use <b>&lt;Space&gt;</b> or the blue button to leave\n network noise and trap a pursuer\n\nBut beware it uses lot of fuel."
      };
    case 3:
      return {
        deck: ["2", "DEDEDEDEDE5556", "ABC3ABC3ABC3ABC"],
        note: ae.note,
        key: [466, 554, 369, 329, 493, 369, 466, 329],
        grid: ["rgba(0,64,255,.05)", "rgba(0,64,255,.05)", "rgba(0,128,255,.05)", "rgba(64,64,255,.05)", "rgba(0,0,255,.05)"],
        bk: "#004",
        desc: "Spawling",
        inst: "Each great mind gives a distinct \nadvantage when freed."
      };
    case 4:
      return {
        deck: ["233333IIIBBCCEE", "EEEEEDDDDD", "GHGHGHIIIIIIIII7"],
        note: ae.wip,
        key: [277, 138, 155, 195, 261, 261, 233, 277],
        grid: ["rgba(0,0,64,.1)", "rgba(0,64,0,.1)", "rgba(0,64,64,.1)"],
        bk: "#8A8",
        desc: "Rich/Dense",
        inst: "You can gain extra lives \nby freeing the minds."
      };
    case 5:
      return {
        deck: ["2GHIIIIIGH33", "EFIEFII", "GHGHGHIIIII456"],
        note: ae.wip,
        key: [277, 138, 155, 195, 261, 261, 233, 277],
        grid: ["rgba(0,0,64,.1)", "rgba(0,64,0,.1)", "rgba(0,64,64,.1)"],
        bk: "#FCC",
        desc: "Limbs",
        inst: ""
      };
    case 6:
      return {
        deck: ["2IIFF", "GHGG3333","ABCABCFFFF4567"],
        note: ae.note,
        key: [277, 138, 155, 195, 261, 261, 233, 277],
        grid: ["rgba(255,64,64,.05)", "rgba(192,0,0,.05)", "rgba(255,0,0,.05)", "rgba(192,0,0,.05)", "rgba(255,64,64,.05)"],
        bk: "#000",
        desc: "Dense",
        inst: ""
      };
    case 7:
      return {
        deck: ["2GHGH", "DEDEDEDEDE4567", "ABC3ABC3ABC3ABCABC3ABC3ABC3ABCIIII"],
        note: ae.note,
        key: [277, 138, 155, 195, 261, 261, 233, 277],
        grid: ["rgba(0,64,128,.05)", "rgba(0,255,128,.05)", "rgba(0,128,225,.05)", "rgba(64,255,64,.05)", "rgba(64,64,192,.05)", "rgba(0,0,128,.05)"],
        bk: "#000",
        desc: "Ultra-dense",
        inst: ""
      };
    case 8:
      return {
        deck: ["2IIIIIIII", "ABCIIIIGHGH","GHGHGHGHG444567333333" ],
        note: ae.wip,
        key: [277, 138, 155, 195, 261, 261, 233, 277],
        grid: ["rgba(255,255,255,.1)", "rgba(255,255,0,.1)", "rgba(255,255,255,.1)", "rgba(255,255,0,.1)", "rgba(255,255,255,.1)", "rgba(255,255,0,.1)"],
        bk: "#500",
        desc: "contained"
      };
  }
}
