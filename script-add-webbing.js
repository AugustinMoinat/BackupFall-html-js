var webbings = [];
function getWebbings() {
  updateWebbings();
  return webbings;
}
function initW() {
  var webbingString = localStorage.myWebbings;
  if (webbingString != null) {
    makeWebs(localStorage.myWebbings);
  }
  if (webbings.length == 0) {
    defaultWebbings();
  } else {
    showWebs();
  }
}
var webId = 0;
function addWebbing() {
  // HTML - add an empty webbing input element to the HTML page
  webId++;
  HTMLwebbings = document.getElementById("webs");
  var webbing = document.createElement("div");
  webbing.id = "web" + webId;
  webbing.classList.add("webbing");
  webbing.innerHTML = `
      <div class="center">
        <div class="inline-block center" id="title${webId}"><b>Webbing ${webId}</b></div>
        <input
          type="button"
          class="danger inline-block right"
          onclick="deleteWebbing('web${webId}');updateWebbings();updateWebbingsForSetup()"
          value="Delete Webbing"
        ">
      </div>
      <div class="center">
        <div class="inline-block minispace">
          <div class="inline-block">
            <label for="name${webId}">Name :</label>
            <input 
              type="text" 
              id="name${webId}" 
              value="Webbing ${webId}" 
              onchange="updatetitle(${webId});updateWebbings();updateWebbingsForSetup()"
            />
          </div>
          <div class="inline-block">
            <label for="weight${webId}">  Weight (g/m) :</label>
            <input type="number" step="1" min="1" value="45" id="weight${webId}"/>
          </div>
        </div>
        <div class="inline-block minispace">
          <div class="inline-block"">
            <label for="stretch${webId}">   Stretch (%) :</label>
            <input type="number" step="0.1" min="0.1" value="5" id="stretch${webId}"/>
          </div>
          <div class="inline-block">
            <label for="tension${webId}">@ Tension (kN) :</label>
            <input type="number" step="1" min="1" value="5" id="tension${webId}" />
          </div>
        </div>
      </div>
    </div>
  `;
  HTMLwebbings.appendChild(webbing);
}
function updatetitle(id) {
  // HTML - Makes the title of the input webbing element match with the given name
  const element = document.getElementById("title" + id);
  var name = eval("inputwebbing.name" + id);
  var regEx = /^[0-9a-zA-Z ]+$/;
  if (name.value.match(regEx)) {
    element.innerHTML = "<h3> " + name.value + " </h3>";
  } else {
    alert("Please enter letters, numbers or space only.");
    name.value = "Webbing" + id;
  }
  element.innerHTML = "<h3> " + name.value + " </h3>";
}
function deleteWebbing(id) {
  // HTML - delete a webbing
  const element = document.getElementById(id);
  element.remove();
}
function updateWebbings() {
  // Memory - updates Webbing to match with HTML
  const webbingNodes = document.getElementById("webs").childNodes;
  webbings = [];
  for (let i = 0; i < webbingNodes.length; i++) {
    var id = eval(webbingNodes[i].id.slice(3));
    var n = eval("inputwebbing.name" + id + ".value");
    var w = parseFloat(eval("inputwebbing.weight" + id + ".value"));
    var s = parseFloat(eval("inputwebbing.stretch" + id + ".value"));
    var t = parseFloat(eval("inputwebbing.tension" + id + ".value"));
    var web = { n: n, w: w, s: s, t: t };
    webbings.push(web);
  }
}
function saveWebbings() {
  // LocalStorage - localStorage and memory match with HTML
  updateWebbings();
  localStorage.myWebbings = makeString(webbings);
}
function loadWebbings() {
  // HTML - Html and memory match with Localstorage
  var webbingString = localStorage.myWebbings;
  if (webbingString != null) {
    makeWebs(localStorage.myWebbings);
  } else {
    webbings = [];
  }
  showWebs();
}
function removeWebbings() {
  // LocalStorage - clear webbings
  if (
    confirm(
      "You are about to delete all your webbings stored in memory. Default webbings will still be available. Proceed?"
    )
  ) {
    localStorage.removeItem("myWebbings");
  }
}
function makeString(listwebs) {
  // converts webbing list to a string that can be stored in memory
  stringwebs = "";
  for (let web of listwebs) {
    stringwebs +=
      "{n:" + web.n + ",w:" + web.w + ",s:" + web.s + ",t:" + web.t + "};";
  }
  return stringwebs.slice(0, -1);
}
function makeWebs(stringWebs) {
  // memory - updates the memory with the informations inside a string.
  strings = stringWebs.split(";");
  webbings = [];
  for (string of strings) {
    var values = string.slice(1, -1).split(",");
    var web = {
      n: values[0].slice(2),
      w: values[1].slice(2),
      s: values[2].slice(2),
      t: values[3].slice(2),
    };
    webbings.push(web);
  }
}
function showWebs() {
  // HTML - Html matches with memory
  document.getElementById("webs").innerHTML = "";
  for (let webbing of webbings) {
    addWebbing();
    var name = eval("inputwebbing.name" + webId);
    name.value = webbing.n;
    const element = document.getElementById("title" + webId);
    element.innerHTML = "<h3> " + webbing.n + " </h3>";
    var weight = eval("inputwebbing.weight" + webId);
    weight.value = webbing.w;
    var stretch = eval("inputwebbing.stretch" + webId);
    stretch.value = webbing.s;
    var tension = eval("inputwebbing.tension" + webId);
    tension.value = webbing.t;
  }
}
function defaultWebbings() {
  // HTML - specify a list of default webbings in memory and HTML
  var stringWebs = "";
  stringWebs += "{n:Nylon,w:50,s:9,t:5}";
  stringWebs += ";";
  stringWebs += "{n:Polyester,w:50,s:4,t:5}";
  stringWebs += ";";
  stringWebs += "{n:High tech,w:28,s:1,t:5}";
  makeWebs(stringWebs);
  showWebs();
}
