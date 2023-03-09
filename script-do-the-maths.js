var backupgetstight = false;
function doTheMaths(numbers) {
  var standingT = standingTension(numbers);
  // numbers get adjusted in this function
  var r = orderFreeSection(
    numbers.sections,
    numbers.connections,
    numbers.breaks
  );
  var stretchCurves = getTotalStretch(
    r.freeSections,
    r.totalLength,
    numbers.spot.L,
    numbers.slacker.p
  );
  backupgetstight = false;
  var balancepoint = solveStaticPos(
    stretchCurves.leftStretchCurve,
    stretchCurves.rightStretchCurve,
    numbers.spot.L,
    numbers.spot.h1,
    numbers.spot.h2,
    numbers.setupWeight + numbers.slacker.w
  );
  var F1balance =
    getF1(
      balancepoint[0],
      balancepoint[1],
      numbers.spot.h1,
      stretchCurves.leftStretchCurve
    ) / 1000;
  var F2balance =
    getF2(
      balancepoint[0],
      balancepoint[1],
      numbers.spot.L,
      numbers.spot.h2,
      stretchCurves.rightStretchCurve
    ) / 1000;
  var backuptightbalance = backupgetstight;
  backupgetstight = false;
  var F1bounce =
    getF1(
      balancepoint[0],
      balancepoint[1] - numbers.slacker.b,
      numbers.spot.h1,
      stretchCurves.leftStretchCurve
    ) / 1000;
  var F2bounce =
    getF2(
      balancepoint[0],
      balancepoint[1] - numbers.slacker.b,
      numbers.spot.L,
      numbers.spot.h2,
      stretchCurves.rightStretchCurve
    ) / 1000;
  var backuptightbounce = backupgetstight;
  backupgetstight = false;
  
  var fallpoint = fall(
    balancepoint[1] + numbers.slacker.b + numbers.slacker.h / 2,
    numbers.slacker.l,
    stretchCurves.leftStretchCurve,
    stretchCurves.rightStretchCurve,
    numbers.spot.L,
    numbers.spot.h1,
    numbers.spot.h2,
    numbers.slacker.w,
    numbers.setupWeight,
    balancepoint[1]
  );
  var F1fall =
    getF1(
      fallpoint[2],
      fallpoint[3],
      numbers.spot.h1,
      stretchCurves.leftStretchCurve
    ) / 1000;
  var F2fall =
    getF2(
      fallpoint[2],
      fallpoint[3],
      numbers.spot.L,
      numbers.spot.h2,
      stretchCurves.rightStretchCurve
    ) / 1000;
  var FleashFall =
    getFleash(
      fallpoint[2],
      fallpoint[3],
      numbers.spot.L,
      numbers.spot.h1,
      numbers.spot.h2,
      stretchCurves.leftStretchCurve,
      stretchCurves.rightStretchCurve
    ) / 1000;
  var backuptightfall = backupgetstight;
  backupgetstight = false;
  console.log("start");
  console.log(stretchCurves);
  var backupFallpoint = fall(
    balancepoint[1] + numbers.slacker.b + numbers.slacker.h / 2,
    numbers.slacker.l,
    stretchCurves.leftFallStretchCurve,
    stretchCurves.rightFallStretchCurve,
    numbers.spot.L,
    numbers.spot.h1,
    numbers.spot.h2,
    numbers.slacker.w,
    numbers.setupWeight,
    balancepoint[1]
  );
  console.log("end");
  var F1max =
    getF1(
      backupFallpoint[2],
      backupFallpoint[3],
      numbers.spot.h1,
      stretchCurves.leftFallStretchCurve
    ) / 1000;
  var F2max =
    getF2(
      backupFallpoint[2],
      backupFallpoint[3],
      numbers.spot.L,
      numbers.spot.h2,
      stretchCurves.rightFallStretchCurve
    ) / 1000;
  var F1after =
    getF1(
      backupFallpoint[0],
      backupFallpoint[1],
      numbers.spot.h1,
      stretchCurves.leftFallStretchCurve
    ) / 1000;
  var F2after =
    getF2(
      backupFallpoint[0],
      backupFallpoint[1],
      numbers.spot.L,
      numbers.spot.h2,
      stretchCurves.rightFallStretchCurve
    ) / 1000;
  var FleashMax =
    getFleash(
      backupFallpoint[2],
      backupFallpoint[3],
      numbers.spot.L,
      numbers.spot.h1,
      numbers.spot.h2,
      stretchCurves.leftFallStretchCurve,
      stretchCurves.rightFallStretchCurve
    ) / 1000;
  var backuptightbackup = backupgetstight;
  backupgetstight = false;
  return {
    spot: numbers.spot,
    setupWeight: numbers.setupWeight,
    slacker: numbers.slacker,
    standingT: standingT,
    balancepoint: balancepoint,
    F1balance: F1balance,
    F2balance: F2balance,
    F1bounce: F1bounce,
    F2bounce: F2bounce,
    fallpoint: fallpoint,
    F1fall: F1fall,
    F2fall: F2fall,
    FleashFall: FleashFall,
    backupFall: numbers.breaks.includes(true),
    backupFallpoint: backupFallpoint,
    F1max: F1max,
    F2max: F2max,
    FleashMax: FleashMax,
    F1after: F1after,
    F2after: F2after,
    backuptightbalance: backuptightbalance,
    backuptightbounce: backuptightbounce,
    backuptightfall: backuptightfall,
    backuptightbackup: backuptightbackup,
  };
}
var weightWarning = false;
function heavySetup() {
  el = document.getElementById("heavysetupwarning");
  if (!weightWarning) {
    el.innerHTML =
      "The setup is heavy compared to the slacker, the results will be less accurate";
    weightWarning = true;
  }
}
var leftPull = 0;
var rightPull = 0;
function writeParagraphTension() {
  document.getElementById(
    "emptySetupParagraph"
  ).innerHTML = `So far, you have pulled ${leftPull.toFixed(
    2
  )} meters on the left, and ${rightPull.toFixed(2)} meters on the right. <input
  type="button"
  value="Reset"
  class="smallspace"
  onclick="resetTension(getAllNumbers(getSectionIds(),getWebbings()))"
>`;
}
function pullLeft(distance, ids, webs) {
  if (distance < 0) {
    alert("Please use only positive numbers");
    return;
  }
  leftPull += parseFloat(distance);
  numbers = getAllNumbers(ids, webs);
  standingTension(numbers);
  writeParagraphTension();
}
function releaseLeft(distance, ids, webs) {
  if (distance < 0) {
    alert("Please use only positive numbers");
    return;
  }
  leftPull -= parseFloat(distance);
  if (leftPull < 0) {
    alert("There is no more webbing");
    leftPull = 0;
  }
  numbers = getAllNumbers(ids, webs);
  standingTension(numbers);
  writeParagraphTension();
}
function pullRight(distance, ids, webs) {
  if (distance < 0) {
    alert("Please use only positive numbers");
    return;
  }
  rightPull += parseFloat(distance);
  numbers = getAllNumbers(ids, webs);
  standingTension(numbers);
  writeParagraphTension();
}
function releaseRight(distance, ids, webs) {
  if (distance < 0) {
    alert("Please use only positive numbers");
    return;
  }
  rightPull -= parseFloat(distance);
  if (rightPull < 0) {
    alert("There is no more webbing");
    rightPull = 0;
  }
  numbers = getAllNumbers(ids, webs);
  standingTension(numbers);
  writeParagraphTension();
}
function adjustNumbersLeft(distance, numbers) {
  // find up to which section to remove
  var i = 0; // number of sections to remove
  while (numbers.sections[i].main.l <= distance) {
    distance -= numbers.sections[i].main.l;
    numbers.setupWeight -= numbers.sections[i].weight;
    i++;
  }
  // adjust main and backup length
  var fraction = distance / numbers.sections[i].main.l;
  numbers.sections[i].backup.l *= 1 - fraction;
  numbers.sections[i].main.l *= 1 - fraction;
  // adjust stretch constant
  numbers.sections[i].backup.k /= 1 - fraction;
  numbers.sections[i].main.k /= 1 - fraction;

  // Calculate change in weight
  numbers.setupWeight -= fraction * numbers.sections[i].weight;
  // Remove connections and breaks if any section if fully out
  numbers.sections.splice(0, i);
  numbers.connections.splice(0, i);
  numbers.breaks.splice(0, i);
  return numbers;
}
function adjustNumbersRight(distance, numbers) {
  // find up to which section to remove
  var i = numbers.sections.length; // number of sections to leave
  while (numbers.sections[i - 1].main.l <= distance) {
    distance -= numbers.sections[i - 1].main.l;
    numbers.setupWeight -= numbers.sections[i - 1].weight;
    i--;
  }
  // adjust main and backup length
  var fraction = distance / numbers.sections[i - 1].main.l;
  numbers.sections[i - 1].backup.l *= 1 - fraction;
  numbers.sections[i - 1].main.l *= 1 - fraction;
  // adjust stretch constant
  numbers.sections[i - 1].backup.k /= 1 - fraction;
  numbers.sections[i - 1].main.k /= 1 - fraction;

  // Calculate change in weight
  numbers.setupWeight -= fraction * numbers.sections[i - 1].weight;
  // Remove connections and breaks if any section if fully out
  numbers.sections.splice(i);
  numbers.connections.splice(i);
  numbers.breaks.splice(i);
  return numbers;
}
function resetTension(numbers) {
  leftPull = 0;
  rightPull = 0;
  standingTension(numbers);
  document.getElementById("emptySetupParagraph").innerHTML = "";
}
function standingTension(numbers) {
  numbers = adjustNumbersLeft(leftPull, numbers);
  numbers = adjustNumbersRight(rightPull, numbers);
  var r = orderFreeSection(
    numbers.sections,
    numbers.connections,
    numbers.breaks
  );
  var stretchCurves = getTotalStretch(
    r.freeSections,
    r.totalLength,
    numbers.spot.L,
    numbers.spot.L / 2
  );
  var balancepoint = solveStaticPos(
    stretchCurves.leftStretchCurve,
    stretchCurves.rightStretchCurve,
    numbers.spot.L,
    numbers.spot.h1,
    numbers.spot.h2,
    numbers.setupWeight
  );
  var F1 = getF1(
    balancepoint[0],
    balancepoint[1],
    numbers.spot.h1,
    stretchCurves.leftStretchCurve
  );
  var F2 = getF2(
    balancepoint[0],
    balancepoint[1],
    numbers.spot.L,
    numbers.spot.h2,
    stretchCurves.rightStretchCurve
  );
  var standingT = Math.max(F1, F2) / 1000;
  document.getElementById(
    "T"
  ).innerHTML = `Standing tension: ${standingT.toFixed(2)} kN`;
  return standingT;
}
function getAllNumbers(ids, webs) {
  // Reconstruct the necessary data from the form
  var L = parseFloat(inputSpot.L.value);
  var h1 = parseFloat(inputSpot.h1.value);
  var h2 = parseFloat(inputSpot.h2.value);
  var spot = { L: L, h1: h1, h2: h2 };
  var sw = parseFloat(inputSlacker.w.value);
  var sh = parseFloat(inputSlacker.h.value);
  var sl = parseFloat(inputSlacker.ll.value);
  var sp = parseFloat(inputSlacker.pos.value);
  var sb = parseFloat(inputSlacker.b.value) / 2;
  if (sp > L || sp < 0) {
    alert("Slackliner is not on the line.");
    return;
  }
  var slacker = { w: sw, h: sh, l: sl, p: sp, b: sb };
  var sections = [];
  var connections = [];
  var breaks = [];
  var setupWeight = 0;
  let first = true;
  for (let id of ids) {
    ml = parseFloat(eval("inputSetup.mainlength" + id + ".value"));
    bl = parseFloat(eval("inputSetup.backuplength" + id + ".value"));
    main = eval("inputSetup.mainwebselect" + id + ".value");
    backup = eval("inputSetup.backupwebselect" + id + ".value");
    for (let web of webs) {
      if (web.n == main) {
        mw = web.w / 1000; // Display is in grams
        ms = web.s;
        mt = web.t * 1000; // Display is in kN
      }
      if (web.n == backup) {
        bw = web.w / 1000; // Display is in grams
        bs = web.s;
        bt = web.t * 1000; // Display is in kN
      }
    }
    var sectionWeight = mw * ml + bw * bl;
    sections.push({
      main: {
        l: ml,
        k: (100 * mt) / (ml * ms),
      },
      backup: {
        l: bl,
        k: (100 * bt) / (bl * bs),
      },
      weight: sectionWeight,
    });
    setupWeight += sectionWeight;
    if (!first) {
      connections.push(
        document.querySelector('input[name="options' + id + '"]:checked')
          .value == 1
      );
    } else {
      first = false;
    }
    breaks.push(document.getElementById("break" + id).checked);
  }
  return {
    slacker: slacker,
    spot: spot,
    setupWeight: setupWeight,
    sections: sections,
    connections: connections,
    breaks: breaks,
  };
}
function orderFreeSection(sections, connections, breaks) {
  // Transforms the set-up into a list of free sections (no main-backup connections)
  // return {
  //   freeSections: [{
  //              section:[{
  //                    main:{l:number,k:number},
  //                    backup:{l:number,k:number}
  //                      }],
  //              length:number,
  //              blength:number,
  //              break:bool
  //                 }],
  //   totalLength:number
  //         }
  var totalLength = 0;
  var freeSections = [];
  var thisSection = [sections[0]];
  var breaking = breaks[0];
  for (let i = 1; i < sections.length; i++) {
    if (connections[i - 1]) {
      // if there is a connection, treat the previous free section
      var treatment = treatSection(thisSection);
      freeSections.push({
        section: treatment.free,
        length: treatment.length,
        blength: treatment.blenght,
        break: breaking,
      });
      totalLength += treatment.length;
      breaking = false;
      thisSection = [];
    }
    thisSection.push(sections[i]);
    breaking = breaking || breaks[i];
  }
  // at the end, treat the last free section
  var treatment = treatSection(thisSection);
  freeSections.push({
    section: treatment.free,
    length: treatment.length,
    blength: treatment.blenght,
    break: breaking,
  });
  totalLength += treatment.length;
  return { freeSections: freeSections, totalLength: totalLength };
}
function treatSection(thisSection) {
  // Checks that mainline is shorter than backup. Flips the setup otherwise.
  // returns {length:number,free:[{main:{l:number,k:number},backup:{l:number,k:number}}]}
  var ml = 0;
  var bl = 0;
  var free = [];
  var l = 0;
  for (let section of thisSection) {
    ml += section.main.l;
    bl += section.backup.l;
  }
  if (bl < ml) {
    // switch main and backup
    alert(
      "Switching main and backup on one section because the backup is shorter"
    );
    for (let section of thisSection) {
      free.push({
        main: Object.assign({}, section.backup),
        backup: Object.assign({}, section.main),
      });
    }
    l = bl;
    bl = ml;
  } else {
    free = [...thisSection];
    l = ml;
  }
  return { length: l, blenght: bl, free: free };
}
function getTotalStretch(freeSections, totalLength, spotLength, slackerPos) {
  // input: freeSections: [{
  //              section:[{
  //                    main:{l:number,k:number},
  //                    backup:{l:number,k:number}
  //                      }],
  //              length:number,
  //              blength:number,
  //              break:bool
  //                 }],
  //      totalLength:number,
  //      spotLength:number,
  //      slackerPos:number
  // output:
  var length = 0;
  const webbingRatio = totalLength / spotLength;
  const slackerPosOnWeb = slackerPos * webbingRatio;
  var i = 0; // index of the sections
  var leftStretchCurve = []; // stretch curve for webbing before slackliner
  var leftFallStretchCurve = []; // stretch curve for webbing before slackliner, in the fall
  var rightStretchCurve = []; // stretch curve for webbing after slackliner
  var rightFallStretchCurve = []; // stretch curve for webbing after slackliner, in the fall
  // treat all the sections until the slackliner's position
  while (length + freeSections[i].length <= slackerPosOnWeb) {
    length += freeSections[i].length;
    var r = sectionStretch(freeSections[i].section, freeSections[i].break);
    leftStretchCurve.push(r.StretchCurve);
    leftFallStretchCurve.push(r.FallStretchCurve);
    i++;
  }
  // if the slackliner isn't on a connection, treat specifially that section
  if (length < slackerPosOnWeb) {
    const slackerPosOnSection = slackerPosOnWeb - length;
    const slackerPosOnBAckupSection =
      (slackerPosOnSection * freeSections[i].blength) / freeSections[i].length;

    const sections = freeSections[i].section;
    const breaks = freeSections[i].break;

    r = sectionStretchWithSlacker(
      sections,
      breaks,
      slackerPosOnSection,
      slackerPosOnBAckupSection
    );
    leftStretchCurve.push(r.leftStretchCurve);
    leftFallStretchCurve.push(r.leftFallStretchCurve);

    rightStretchCurve.push(r.rightStretchCurve);
    rightFallStretchCurve.push(r.rightFallStretchCurve);
    i++;
  }
  // treat all the sections after the slackliner
  while (i < freeSections.length) {
    var r = sectionStretch(freeSections[i].section, freeSections[i].break);
    rightStretchCurve.push(r.StretchCurve);
    rightFallStretchCurve.push(r.FallStretchCurve);
    i++;
  }

  return {
    leftStretchCurve: agglomerateStretch(leftStretchCurve),
    rightStretchCurve: agglomerateStretch(rightStretchCurve),
    leftFallStretchCurve: agglomerateStretch(leftFallStretchCurve),
    rightFallStretchCurve: agglomerateStretch(rightFallStretchCurve),
  };
}
function sectionStretch(sections, breaks) {
  // input: sections: [{main:{l:number, k:number}, backup:{l:number, k:number}}], breaks: boolean
  // a list of sections caracterised by length and stretch constants. sum(main.l)>= sum(backup.l)
  //
  // output: StretchCurve:{l:number[], t:number[]},
  //         FallStretchCurve:{l:number[], t:number[]}
  // critical lengths and corresponding tensions of this overall section of setup, for interpolation.
  //
  // The values are the same if breaks=false, otherwise calculated assuming the mainline is gone.
  var mainl = sections[0].main.l;
  var backupl = sections[0].backup.l;
  var kminv = 1 / sections[0].main.k;
  var kbinv = 1 / sections[0].backup.k;
  for (var j = 1; j < sections.length; j++) {
    // agglomerate the lengths and the inverse stretch constants
    mainl += sections[j].main.l;
    backupl += sections[j].backup.l;
    kminv += 1 / sections[j].main.k;
    kbinv += 1 / sections[j].backup.k;
  }
  var km = 1 / kminv;
  var kb = 1 / kbinv;
  var r = curveFromConstants(km, kb, mainl, backupl, breaks);
  return {
    StretchCurve: { l: r.lengths, t: r.tensions },
    FallStretchCurve: { l: r.fLengths, t: r.fTensions },
  };
}
function curveFromConstants(km, kb, mainl, backupl, breaks) {
  // calculates the section stretch curve from main and back-up stretch constants and lengths.
  // breaks: boolean determines if the mainline breaks to compute the fall stretch curve
  var lengths = [];
  var tensions = [];
  if (mainl == backupl) {
    lengths = [mainl, 4 * mainl];
    tensions = [0, 3 * (kb + km) * backupl];
  } else {
    lengths = [mainl, backupl, 4 * backupl];
    tensions = [
      0,
      km * (backupl - mainl),
      km * (4 * backupl - mainl) + 3 * kb * backupl,
    ];
  }
  var fLengths = [...lengths];
  var fTensions = [...tensions];
  if (breaks) {
    // custom values
    fLengths = [backupl, 4 * backupl];
    fTensions = [0, 3 * kb * backupl];
  }
  return {
    lengths: lengths,
    tensions: tensions,
    fLengths: fLengths,
    fTensions: fTensions,
  };
}
function sectionStretchWithSlacker(
  sections,
  breaks,
  slackerPosOnSection,
  slackerPosOnBAckupSection
) {
  // input: sections: [{main:{l:number, k:number}, backup:{l:number, k:number}}],
  //        breaks: boolean
  //        slackerPosOnSection: number
  //        slackerPosOnBackupSection: number
  // a list of sections caracterised by length and stretch constants. sum(main.l)>= sum(backup.l)
  // the position along the line and the backupline of the slackliner
  //
  // output: (left/right)StretchCurve:{l:number[], t:number[]},
  //         (left/right)FallStretchCurve:{l:number[], t:number[]}
  // critical lengths and corresponding tensions of this overall section of setup, for interpolation.
  //
  // The values are the same if breaks=false, otherwise calculated assuming the mainline is gone.
  var j = 0;
  var k = 0;
  var mainl = 0;
  var backupl = 0;
  var kminv = 0;
  var kbinv = 0;
  // agregate all info until the slacker's position
  while (mainl + sections[j].main.l < slackerPosOnSection) {
    mainl += sections[j].main.l;
    kminv += 1 / sections[j].main.k;
    j++;
  }
  while (backupl + sections[k].backup.l < slackerPosOnBAckupSection) {
    backupl += sections[k].backup.l;
    kbinv += 1 / sections[k].backup.k;
    k++;
  }
  // take the necessary part of the following section
  var mainlfrac = slackerPosOnSection - mainl;
  kminv += mainlfrac / (sections[j].main.k * sections[j].main.l);
  var backuplfrac = slackerPosOnBAckupSection - backupl;
  kbinv += backuplfrac / (sections[k].backup.k * sections[k].backup.l);
  var km = 1 / kminv;
  var kb = 1 / kbinv;
  // get the curve for the section of webbing to the left of the slackliner
  var rleft = curveFromConstants(
    km,
    kb,
    slackerPosOnSection,
    slackerPosOnBAckupSection,
    breaks
  );
  var leftStretchCurve = { l: rleft.lengths, t: rleft.tensions };
  var leftFallStretchCurve = { l: rleft.fLengths, t: rleft.fTensions };
  // aggregate all the info starting again from the slackliner's position
  mainl = sections[j].main.l - mainlfrac;
  backupl = sections[k].backup.l - backuplfrac;
  kminv = mainl / (sections[j].main.k * sections[j].main.l);
  kbinv = backupl / (sections[k].backup.k * sections[k].backup.l);
  for (var jj = j + 1; jj < sections.length; jj++) {
    mainl += sections[jj].main.l;
    kminv += 1 / sections[jj].main.k;
  }
  for (var kk = k + 1; kk < sections.length; kk++) {
    backupl += sections[kk].backup.l;
    kbinv += 1 / sections[kk].backup.k;
  }
  km = 1 / kminv;
  kb = 1 / kbinv;
  // get the curve for the webbing to the right of the slackliner
  var rright = curveFromConstants(km, kb, mainl, backupl, breaks);
  var rightStretchCurve = { l: rright.lengths, t: rright.tensions };
  var rightFallStretchCurve = { l: rright.fLengths, t: rright.fTensions };
  return {
    leftStretchCurve: leftStretchCurve,
    rightStretchCurve: rightStretchCurve,
    leftFallStretchCurve: leftFallStretchCurve,
    rightFallStretchCurve: rightFallStretchCurve,
  };
}

function agglomerateStretch(stretchCurve) {
  // Combines a list of stretch curves given each by {l:number[], t:number[]}
  // the list of lengths and corresponding tensions.
  // l and t are strictly increasing, and same size.
  // output: the stretch curve obtain by putting all systems in series.
  curve = stretchCurve[0];
  for (let i = 1; i < stretchCurve.length; i++) {
    curve = combineStretch(curve, stretchCurve[i]);
  }
  return curve;
}
function combineStretch(stretchCurve1, stretchCurve2) {
  // Combines two stretch curves given each by {l:number[], t:number[]}
  // the list of lengths and corresponding tensions.
  // l and t are strictly increasing, and same size.
  // output: the stretch curve obtain by putting the two systems in series.
  // highest tension value is ignored: the other system already broke.
  var t = [];
  var l = [];
  var i1 = 0;
  var i2 = 0;
  while (i1 < stretchCurve1.l.length && i2 < stretchCurve2.l.length) {
    t1 = stretchCurve1.t[i1];
    t2 = stretchCurve2.t[i2];
    if (t1 == t2 || ((t1 - t2) * (t1 - t2)) / (t1 * t1) < 0.00001) {
      //equals or rounding error
      t.push(t1);
      l.push(stretchCurve1.l[i1] + stretchCurve2.l[i2]);
      i1++;
      i2++;
    } else {
      if (t1 < t2) {
        t.push(t1);
        l.push(stretchCurve1.l[i1] + lengthFromForce(t1, stretchCurve2));
        i1++;
      } else {
        t.push(t2);
        l.push(stretchCurve2.l[i2] + lengthFromForce(t2, stretchCurve1));
        i2++;
      }
    }
  }
  return { l: l, t: t };
}
function forceFromLength(l, stretchCurve) {
  // gets the force corresponding to a length, given by a stretch curve.
  var i = 0;
  while (stretchCurve.l[i] < l) {
    i++;
    if (i == stretchCurve.l.length) {
      alert("More than 300% extension on one webbing section, process failed.");
    }
  }
  if (i == 0) {
    return 0;
  }
  if (i > 1) {
    backupgetstight = true;
  }
  var li = stretchCurve.l[i];
  var lii = stretchCurve.l[i - 1];
  var ti = stretchCurve.t[i];
  var tii = stretchCurve.t[i - 1];
  var f = (l * (ti - tii) + li * tii - ti * lii) / (li - lii);
  return f;
}
function lengthFromForce(t, stretchCurve) {
  // gets the length corresponding to a force, given by a stretch curve.
  if (t <= 0) {
    return stretchCurve.l[0];
  }
  var i = 0;
  while (stretchCurve.t[i] < t) {
    i++;
    if (i == stretchCurve.t.length) {
      alert("More than 300% extension on one webbing section, process failed.");
    }
  }
  var li = stretchCurve.l[i];
  var lii = stretchCurve.l[i - 1];
  var ti = stretchCurve.t[i];
  var tii = stretchCurve.t[i - 1];
  return (t * (li - lii) + lii * ti - tii * li) / (ti - tii);
}
function potentialEnergyFromLength(l, stretchCurve) {
  // computes the elastic energy stored in a webbing
  // caracterised by stretchCurve, stretched to a lenght l
  var i = 0;
  var e = 0;
  var t = forceFromLength(l, stretchCurve);
  while (stretchCurve.l[i] < l) {
    if (i > 0) {
      e +=
        ((stretchCurve.t[i - 1] + stretchCurve.t[i]) *
          (stretchCurve.l[i] - stretchCurve.l[i - 1])) /
        2;
    }
    i++;
    if (i == stretchCurve.l.length) {
      alert("More than 300% extension on one webbing section, process failed.");
      return;
    }
  }
  if (i == 0) {
    return 0;
  }
  e += ((t + stretchCurve.t[i - 1]) * (l - stretchCurve.l[i - 1])) / 2;
  return e;
}
// ----------------------------------------------------------------------------------------------------------
//                       Physical model
//-----------------------------------------------------------------------------------------------------------
function findFirstX(l01, l02, L) {
  // Finds the lengthwise point of balance of the line with no weight
  return (L * l01) / (l01 + l02);
}
function findFirstY(l01, l02, L, h1, h2, x0) {
  // Finds the point to which the line sags before it starts to stretch.
  // if the line is aleardy stretched, returns the proportinal point
  if (l01 + l02 < Math.sqrt(Math.pow(L, 2) + Math.pow(h1 - h2, 2))) {
    return (h1 * l01 + h2 * l02) / (l01 + l02);
  } else {
    return (
      0.5 *
      (h1 +
        h2 -
        Math.sqrt(Math.pow(l01, 2) - Math.pow(x0, 2)) -
        Math.sqrt(Math.pow(l02, 2) - Math.pow(L - x0, 2)))
    );
  }
}
function getl1(x, y, h1) {
  // Calculates the length of the line on the first side
  return Math.sqrt(Math.pow(x, 2) + Math.pow(h1 - y, 2));
}
function getl2(x, y, L, h2) {
  // Calculates the length of the line on the second side
  return Math.sqrt(Math.pow(L - x, 2) + Math.pow(h2 - y, 2));
}
function getF1(x, y, h1, stretchCurve) {
  // calculates the tension in the line on the first side
  return forceFromLength(getl1(x, y, h1), stretchCurve);
}
function getF2(x, y, L, h2, stretchCurve) {
  // calculates the tension in the line on the first side
  return forceFromLength(getl2(x, y, L, h2), stretchCurve);
}
function getFleash(x, y, L, h1, h2, stretchCurve1, stretchCurve2) {
  // Find the vertical force created by the line
  var F1 = getF1(x, y, h1, stretchCurve1);
  var F2 = getF2(x, y, L, h2, stretchCurve2);
  var l1 = getl1(x, y, h1);
  var l2 = getl2(x, y, L, h2);
  return ((h1 - y) * F1) / l1 + ((h2 - y) * F2) / l2;
}
function forceX(x, y, L, h1, h2, stretchCurve1, stretchCurve2) {
  // Calculates the sum of the forces in the x direction
  var l1 = getl1(x, y, h1);
  var l2 = getl2(x, y, L, h2);
  return (
    (-x * getF1(x, y, h1, stretchCurve1)) / l1 +
    ((L - x) * getF2(x, y, L, h2, stretchCurve2)) / l2
  );
}
function forceY(x, y, L, h1, h2, stretchCurve1, stretchCurve2, p) {
  // Calculates the sum of the forces in the y direction
  return p - getFleash(x, y, L, h1, h2, stretchCurve1, stretchCurve2);
}
function iterateY(x, y, dy, L, h1, h2, stretchCurve1, stretchCurve2, p) {
  // One step of iteration by interpolating between (x,y) and (x,y+dy)
  // to find the point where the forces balance
  // avoid some computational errors along the way
  if (dy == 0) {
    return y;
  }
  var FY = forceY(x, y, L, h1, h2, stretchCurve1, stretchCurve2, p);
  var FdY = forceY(x, y + dy, L, h1, h2, stretchCurve1, stretchCurve2, p);
  console.log(y,FY);
  if (FY == FdY) {
    console.log("iteration y maybe wrong");
    return y + dy / 2;
  }
  return ((y + dy) * FY - y * FdY) / (FY - FdY);
}
function iterateX(x, dx, y, L, h1, h2, stretchCurve1, stretchCurve2) {
  // One step of iteration by interpolating between (x,y) and (x+dx,y)
  // to find the point where the forces balance
  // avoid some computational errors along the way
  if (dx == 0) {
    return x;
  }
  var FX = forceX(x, y, L, h1, h2, stretchCurve1, stretchCurve2);
  var FdX = forceX(x + dx, y, L, h1, h2, stretchCurve1, stretchCurve2);
  if (FX == FdX) {
    console.log("iteration x maybe wrong");
    return x + dx / 2;
  }
  return ((x + dx) * FX - x * FdX) / (FX - FdX);
}
function solveStaticPos(stretchCurve1, stretchCurve2, L, h1, h2, m) {
  // Finds the static balance position with an iterative approach
  // @Inputs:
  // stretchCurve1, stretchCurve2: piecewise linear stretch curves
  // of the webbing on each side
  // L, h1, h2: Length of the gap and height of each anchor
  // m: mass of the body
  // @Outputs:
  // x, y: the final position
  //
  var p = 9.81 * m;
  // Find the first step lenght
  var dx = L / 100;
  var dy = -L / 100;
  // Find the starting position for the iteration
  var l01 = stretchCurve1.l[0];
  var l02 = stretchCurve2.l[0];
  var x = findFirstX(l01, l02, L);
  var y = findFirstY(l01, l02, L, h1, h2, x);
  // First approximation to get into the area where interpolation works
  var FY = forceY(x, y, L, h1, h2, stretchCurve1, stretchCurve2, p);
  while (FY > 0) {
    y += dy;
    FY = forceY(x, y, L, h1, h2, stretchCurve1, stretchCurve2, p);
    console.log(y,FY);
    var x1 = iterateX(x, dx, y, L, h1, h2, stretchCurve1, stretchCurve2);
    dx = Math.max(Math.min(x1 - x, L / 50), -L / 50); // avoid too big steps from computational error
    x += dx;
  }
  dy = dy / 10;
  // Iterate while the step remains above some threshold
  while (Math.abs(dx) + Math.abs(dy) > L / 50000) {
    // One step in y
    var y1 = iterateY(x, y, dy, L, h1, h2, stretchCurve1, stretchCurve2, p);
    dy = Math.max(Math.min(y1 - y, L / 10), -L / 10); // avoid too big steps from computational error
    y += dy;
    // One step in x
    x1 = iterateX(x, dx, y, L, h1, h2, stretchCurve1, stretchCurve2);
    dx = Math.max(Math.min(x1 - x, L / 50), -L / 50); // avoid too big steps from computational error
    x += dx;
  }
  return [x, y];
}
function interateEnergyY(
  x,
  y,
  yy,
  dy,
  h1,
  h2,
  L,
  stretchCurve1,
  stretchCurve2,
  mSlacker,
  mLine,
  yLine,
  E0
) {
  // One step of iteration in y direction by interpolating between (x,y) and (x,y+dy)
  // to find the point where the energy balances with E0.
  // avoid some computational errors along the way
  if (dy == 0) {
    return y;
  }
  var Ey = getEtotal(
    x,
    y,
    yy,
    h1,
    h2,
    L,
    stretchCurve1,
    stretchCurve2,
    mSlacker,
    mLine,
    yLine
  );
  var Edy = getEtotal(
    x,
    y,
    yy + dy,
    h1,
    h2,
    L,
    stretchCurve1,
    stretchCurve2,
    mSlacker,
    mLine,
    yLine
  );
  if (Ey == Edy) {
    console.log("Energy iteration maybe wrong");
    return y + dy / 2;
  }
  return (E0 * dy - (yy + dy) * Ey + yy * Edy) / (Edy - Ey);
}
function fall(
  y,
  leash,
  stretchCurve1,
  stretchCurve2,
  L,
  h1,
  h2,
  mSlacker,
  mLine,
  yLine
) {
  // Computes the fall using conservation of energy
  // @Inputs:
  // y: original height of body (m) (initial speed is 0)
  // leash: leash length (m)
  // stretchCurve1, stretchCurve2: piecewise linear stretch curves
  // of the webbing on each side
  // L, h1, h2 (m): width of the gap and height of each anchor
  // mSlacker: mass of the body (in kg)
  // mLine: mass of the webbing (in kg)
  // yLine: original height of the line (m)
  // @Output: [xf,yf,yb]
  // xf, yf: final position of the leashring
  // yb: height at the bottom of the bounce
  //
  // find out the final position after the fall has settled
  var l01 = stretchCurve1.l[0];
  var l02 = stretchCurve2.l[0];
  var x0 = findFirstX(l01, l02, L);
  var y0 = findFirstY(l01, l02, L, h1, h2, x0);
  var [xf, yf] = solveStaticPos(
    stretchCurve1,
    stretchCurve2,
    L,
    h1,
    h2,
    mSlacker + mLine
  );
  // find out if the initial position has some tension in the line
  var E0 = 0;
  if (y0 > y + leash) {
    // the slackliner is pulling the line down from its balance position
    E0 = getEline(xf, y + leash, h1, h2, L, stretchCurve1, stretchCurve2);
  } else {
    if (l01 + l02 < Math.sqrt(Math.pow(L, 2) + Math.pow(h1 - h2, 2))) {
      // the line has some stored enegy, even with no one on.
      E0 = getEline(x0, y0, h1, h2, L, stretchCurve1, stretchCurve2);
    }
  }
  // runs from balance position down to find the point where become negative
  var yy = yf;
  var dy = -L / 100;
  var Ey = getEtotal(
    xf,
    y + leash,
    yy,
    h1,
    h2,
    L,
    stretchCurve1,
    stretchCurve2,
    mSlacker,
    mLine,
    yLine
  );
  while (Ey < E0) {
    yy += dy;
    Ey = getEtotal(
      xf,
      y + leash,
      yy,
      h1,
      h2,
      L,
      stretchCurve1,
      stretchCurve2,
      mSlacker,
      mLine,
      yLine
    );
  }
  // use interpolation to find the result more precisely
  var xx = xf
  var dx = L/100;
  while (Math.abs(dx) +Math.abs(dy) > L / 50000) {
    // vertical direction with the energy
    yy1 = interateEnergyY(
      xx,
      y + leash,
      yy,
      dy,
      h1,
      h2,
      L,
      stretchCurve1,
      stretchCurve2,
      mSlacker,
      mLine,
      yLine,
      E0
    );
    dy = Math.max(Math.min(yy1 - yy, L / 10), -L / 10);
    yy += dy;
    // horizontal direction with the force
    xx1 = iterateX(xx, dx, yy, L, h1, h2, stretchCurve1, stretchCurve2);
    dx = Math.max(Math.min(xx1 - xx, L / 50), -L / 50); // avoid too big steps from computational error
    xx += dx;
  }
  return [xf, yf, xx, yy];
}
function getEline(x, y, h1, h2, L, stretchCurve1, stretchCurve2) {
  // Finds the elastic energy stored in the webbing
  var l1 = getl1(x, y, h1);
  var l2 = getl2(x, y, L, h2);
  return (
    potentialEnergyFromLength(l1, stretchCurve1) +
    potentialEnergyFromLength(l2, stretchCurve2)
  );
}
function getEtotal(
  x,
  y0,
  y,
  h1,
  h2,
  L,
  stretchCurve1,
  stretchCurve2,
  m,
  mLine,
  yLine
) {
  // Find the total energy from the line
  // plus the potential energy with the fall from the original height
  var Eline = getEline(x, y, h1, h2, L, stretchCurve1, stretchCurve2);
  var Epot = m * 9.81 * (y - y0);
  var Epotline = (mLine * 9.81 * (y - yLine)) / 2;
  return Eline + Epot + Epotline;
}
