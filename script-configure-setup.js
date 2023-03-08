var webbings = [];
var sectionIds = [];
function getSectionIds() {
  return sectionIds;
}
var secId = 0;
var webbingNames = [];
function initS() {
  showSetupList();
  if (setupList.length == []) {
    addSection();
  } else {
    loadSetup(setupList[0]);
  }
}
function updateWebbingNames() {
  // Memory - update the list of webbing names
  const webbingNodes = document.getElementById("webs").childNodes;
  webbingNames = [];
  for (let i = 0; i < webbingNodes.length; i++) {
    var id = eval(webbingNodes[i].id.slice(3));
    var n = eval("inputwebbing.name" + id + ".value");
    webbingNames.push(n);
  }
}
function updateWebbingsForSetup() {
  // Memory - updates webbings to match with HTML
  const webbingNodes = document.getElementById("webs").childNodes;
  webbings = [];
  webbingNames = [];
  for (let i = 0; i < webbingNodes.length; i++) {
    var id = eval(webbingNodes[i].id.slice(3));
    var n = eval("inputwebbing.name" + id + ".value");
    var w = eval("inputwebbing.weight" + id + ".value");
    var s = eval("inputwebbing.stretch" + id + ".value");
    var t = eval("inputwebbing.tension" + id + ".value");
    var web = { n: n, w: w, s: s, t: t };
    webbings.push(web);
    webbingNames.push(n);
  }
  var stillRememberAllWebbings = true;
  for (let id of sectionIds) {
    mainselect = document.getElementById("mainwebselect" + id);
    mainvalue = mainselect.value;
    backupselect = document.getElementById("backupwebselect" + id);
    backupvalue = backupselect.value;
    mainselect.innerHTML = "";
    backupselect.innerHTML = "";
    for (let webbing of webbings) {
      var optionmain = document.createElement("option");
      optionmain.value = webbing.n;
      optionmain.innerHTML = webbing.n;
      mainselect.appendChild(optionmain);
      var optionbackup = document.createElement("option");
      optionbackup.value = webbing.n;
      optionbackup.innerHTML = webbing.n;
      backupselect.appendChild(optionbackup);
    }
    if (webbingNames.includes(mainvalue)) {
      mainselect.value = mainvalue;
    } else {
      stillRememberAllWebbings = mainvalue == "";
    }
    if (webbingNames.includes(backupvalue)) {
      backupselect.value = backupvalue;
    } else {
      stillRememberAllWebbings = backupvalue == "";
    }
  }
  if (!stillRememberAllWebbings) {
    console.log(webbingNames);
    alert(
      "Some webbings from this setup are no longer in memory. They have been replaced by a default value."
    );
  }
}
function addSection() {
  // HTML - add an default section input element to the HTML page
  // If the section is not the first, also adds a button for connection
  secId++;
  HTMLsections = document.getElementById("secs");
  if (sectionIds.length != 0) {
    var button = document.createElement("div");
    button.id = "secbtn" + secId;
    button.classList.add("center");
    button.innerHTML = `
      <div class="center">
        <button type="button">
          <input
            type="radio" 
            name="options${secId}" 
            id="connect${secId}" 
            autocomplete="off" 
            checked
            value="1"
            onchange="unhighlight(noConnect${secId});"
          > Main and Backup connected
        </button>
        <button type="button" id="noConnect${secId}" #noConnect${secId}>
          <input 
            type="radio" 
            name="options${secId}" 
            id="disconnect${secId}" 
            autocomplete="off"
            value="0"
            onchange="highlight(noConnect${secId});"
          > No connection Main Backup
        </button>
      </div>`;
    HTMLsections.appendChild(button);
  }
  sectionIds.push(secId);
  var section = document.createElement("div");
  section.id = "sec" + secId;
  section.classList.add( "section", "space");
  section.innerHTML = `
      <div>
        <input
          type="button"
          class="inline-block center" 
          onclick="duplicateSection(${secId})"
          value="Duplicate"
        >
        <input
          type="button"
          class="danger inline-block right"
          class="btn btn-sm btn-outline-danger" 
          onclick="deleteSection(${secId})"
          value="Delete"
        >
      </div>
      <div class="center">
        <div class="inline-block">
          <div class="inline-block minispace">
            <label for="mainwebselect${secId}"> Main webbing :</label>
            <select name="mainwebselect${secId}" id="mainwebselect${secId}"></select>
          </div>
          <div class="inline-block minispace">
            <label for="mainlength${secId}"> Main length (m):</label>
            <input type="number" step="0.5" id="mainlength${secId}" value="50"/>
          </div>
        </div>
        <div class="inline-block">
          <div class="inline-block minispace">
            <label for="backupwebselect${secId}"> Back-up webbing :</label>
            <select name="backupwebselect${secId}" id="backupwebselect${secId}"></select>
          </div>
          <div class="inline-block minispace">
            <label for="backuplength${secId}"> Back-up length (m):</label>
            <input type="number" step="0.5" id="backuplength${secId}" value="55"/>
          </div>
        </div>
      </div>
      <div class="center minispace">
        <button
          type="button"
          class="inline-block center"
          class="btn btn-sm btn-outline-danger" 
          id="breaklabel${secId}">
          <input type="checkbox" id="break${secId}" onchange="classChange('breaklabel${secId}')"> Break Mainline
        </button>
      </div>
      `;
  HTMLsections.appendChild(section);
  updateWebbingsForSetup();
}
function highlight(el){
  el.classList.add("danger");
}
function unhighlight(el){
  el.classList.remove("danger");
}
function classChange(id) {
  var el = document.getElementById(id);
  if (el.classList.contains("danger")) {
    el.classList.remove("danger");
  } else {
    el.classList.add("danger");
  }
}
function deleteSection(id) {
  // HTML - delete a section and the corresponding button
  const element = document.getElementById("sec" + id);
  const button = document.getElementById("secbtn" + id);
  if (button != null) {
    button.remove();
  } else {
    if (element.nextSibling?.id.startsWith("secbtn")) {
      element.nextSibling.remove();
    }
  }
  element.remove();
  sectionIds.splice(sectionIds.indexOf(id), 1);
}
function duplicateSection(id) {
  // HTML - duplicate a section
  addSection();
  oldsec = document.getElementById("sec" + id);
  newsec = document.getElementById("sec" + secId);
  newbutton = document.getElementById("secbtn" + secId);
  var oldmain = eval("inputSetup.mainwebselect" + id);
  var newmain = eval("inputSetup.mainwebselect" + secId);
  newmain.value = oldmain.value;
  var oldmainL = eval("inputSetup.mainlength" + id);
  var newmainL = eval("inputSetup.mainlength" + secId);
  newmainL.value = oldmainL.value;
  var oldbu = eval("inputSetup.backupwebselect" + id);
  var newbu = eval("inputSetup.backupwebselect" + secId);
  newbu.value = oldbu.value;
  var oldbuL = eval("inputSetup.backuplength" + id);
  var newbuL = eval("inputSetup.backuplength" + secId);
  newbuL.value = oldbuL.value;
  HTMLsections = document.getElementById("secs");
  HTMLsections.insertBefore(newsec, oldsec);
  HTMLsections.insertBefore(oldsec, newsec);
  HTMLsections.insertBefore(newbutton, newsec);
  sectionIds.splice(sectionIds.indexOf(id), 1, id, secId);
  sectionIds.pop();
}

// Manage the setups in localStorage
const keyset = "MySetup";
const keylist = "AllMySetups";
var setupList = []; // reference list of all setups
function loadSetupList() {
  // Memory - loads the list of setups that are in LocalStorage
  locallist = localStorage.getItem(keylist);
  if (locallist != null && locallist.trim() != "") {
    setupList = locallist.split(",");
  }
}
function showSetupList() {
  // HTML - shows the list of setup names in the selector
  loadSetupList();
  var selector = document.getElementById("setupName");
  selector.innerHTML = "";
  for (let setup of setupList) {
    option = document.createElement("option");
    option.value = setup;
    option.innerHTML = setup;
    selector.appendChild(option);
  }
}
function updateSetupList() {
  // LocalStorage - saves the list of setups that are in LocalStorage
  localStorage.setItem(keylist, setupList.join(","));
}
function saveSetup(name) {
  // LocalStorage - Save a set-up and updates the list of setups
  var regEx = /^[0-9a-zA-Z ]+$/;
  name = name.trim();
  if (name.match(regEx)) {
    loadSetupList();
    if(setupList.indexOf(name)==-1){
      setupList.push(name);
      updateSetupList();
    }
    localStorage.setItem(keyset + name, setupToString());
  } else {
    alert("Please enter letters, numbers or space only.");
  }
  showSetupList();
}
function loadSetup(name) {
  // HTML - loads one setup.
  if (name != "") {
    var setupString = localStorage.getItem(keyset + name);
    stringToSetup(setupString);
  }
}
function deleteSetup(name) {
  // Local Storage - delete one setup in memory
  loadSetupList();
  console.log(setupList);
  setupList.splice(setupList.indexOf(name), 1);
  localStorage.removeItem(keyset + name);
  updateSetupList();
  showSetupList();
}
function deleteAllSetups() {
  // Local Storage - delete all setups in memory
  if (
    confirm(
      "You are about to delete all your setups stored in memory. Proceed?"
    )
  ) {
    loadSetupList();
    console.log(setupList);
    while(setupList.length>0) {
      var name=setupList.pop();
      deleteSetup(name);
    }
    localStorage.removeItem(keylist);
  }
  showSetupList();
}
function setupToString() {
  // Get the HTML input for setup and transforms that into a string.
  var sections = "";
  var sep = "";
  for (let id of sectionIds) {
    if (sep == ",") {
      sections +=
        sep +
        document.querySelector('input[name="options' + id + '"]:checked').value;
    }
    var mw = eval("inputSetup.mainwebselect" + id + ".value");
    var ml = eval("inputSetup.mainlength" + id + ".value");
    var bw = eval("inputSetup.backupwebselect" + id + ".value");
    var bl = eval("inputSetup.backuplength" + id + ".value");
    sections += sep + mw + ";" + ml + ";" + bw + ";" + bl;
    sep = ",";
  }
  return sections;
}
function stringToSetup(inputString) {
  // HTML - makes the view match with one set-up given as string
  updateWebbingNames();
  document.getElementById("secs").innerHTML = "";
  sectionIds = [];
  var sections = inputString.split(",");
  var stillRememberAllWebbings = true;
  var connection = true;
  for (let section of sections) {
    if (section == "1" || section == "0") {
      connection = section == "1";
    } else {
      var cara = section.split(";");
      var mw = cara[0];
      var bw = cara[2];
      addSection();
      var main = eval("inputSetup.mainwebselect" + secId);
      if (webbingNames.includes(mw)) {
        main.value = mw;
      } else {
        stillRememberAllWebbings = false;
      }
      var mainlength = eval("inputSetup.mainlength" + secId);
      mainlength.value = cara[1];
      var backup = eval("inputSetup.backupwebselect" + secId);
      if (webbingNames.includes(bw)) {
        backup.value = bw;
      } else {
        stillRememberAllWebbings = false;
      }
      var backuplength = eval("inputSetup.backuplength" + secId);
      backuplength.value = cara[3];
      if (!connection) {
        document.getElementById("disconnect" + secId).checked = true;
        document.getElementById("noConnect" + secId).classList.add("danger")
      }
    }
  }
  if (!stillRememberAllWebbings) {
    alert(
      "Some webbings from this setup are no longer in memory. They have been replaced by a default value."
    );
  }
}
