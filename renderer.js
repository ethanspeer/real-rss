const information = document.getElementById('info');
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

const func = async () => {
    const response = await window.versions.ping()
    console.log(response) // prints out 'pong'
  }
  
  func()

const addFeedBtn = document.getElementById('addFeedBtn');
const container = document.getElementById('container');
const addFeedModal = document.getElementById('addFeedModal');
const addLinkBtn = document.getElementById('addlinkbtn');
const rssName = document.getElementById('rssname');
const rssURL = document.getElementById('rssurl');
var feedLinks = document.getElementById('feedlinks');
var span = document.getElementsByClassName("close")[0];
addFeedBtn.addEventListener('click', () => {
    addFeedModal.style.display = "block";
});

addLinkBtn.addEventListener('click', () => {
  addFeed();
  hideModal();
});

span.addEventListener('click', () => {
    hideModal();
});

window.onclick = function(event) {
    if (event.target == addFeedModal) {
     hideModal();
    }
  }

function hideModal() {
  addFeedModal.style.display = "none";
}

function initialize() {
  if (localStorage["feedList"]) {
    feedLinks.innerHTML = localStorage["feedList"];
    console.log(feedLinks.innerHTML);
    var edit_buttons = document.getElementsByClassName("editBtn");
    for(var i = 0; i < edit_buttons.length; i++) {
        edit_buttons[i].addEventListener("click", editFeed);
    }
    var load_buttons = document.getElementsByClassName("loadBtn");
    for(var j = 0; j < load_buttons.length; j++) {
        load_buttons[j].addEventListener("click", loadFeed);
    }
  }
}

function addFeed () {
  var feedName = document.getElementById("rssname").value;
  var feedText = document.createTextNode(feedName);
  var li = document.createElement("li");
  var editBtn = document.createElement("button");
  var loadBtn = document.createElement("button");
  var icon = document.createElement("img");
  var icon_link = document.createElement("img");


  li.setAttribute("text-align", "center");
  editBtn.setAttribute("class", "editBtn");
  editBtn.addEventListener("click", editFeed);
  loadBtn.setAttribute("class", "loadBtn");
  loadBtn.setAttribute("type", "submit");
  loadBtn.setAttribute("name", rssURL.value);
  loadBtn.addEventListener("click", loadFeed);
  icon.setAttribute("src", "./images/edit.png");
  icon.setAttribute("class", "edit");
  icon.setAttribute("unselectable", "on");
  icon_link.setAttribute("src", "./images/load.png");
  icon_link.setAttribute("class", "edit");
  icon_link.setAttribute("unselectable", "on");

  editBtn.appendChild(icon);
  loadBtn.appendChild(icon_link);
  li.appendChild(feedText);
  li.appendChild(editBtn);
  li.appendChild(loadBtn);
  feedLinks.appendChild(li);

  localStorage["feedList"] = feedLinks.innerHTML
  rssName.value = "";
  rssURL.value = "";
}

function editFeed() {
  console.log("edit");
}

function loadFeed(event) {
  console.log("load");
  container.innerHTML = "";
  const load = event.target;
  console.log(load);
  const URL = load.name;
  console.log(URL);
  fetch(URL)
    .then(response => response.text())
    .then(data => parse(data))
}

function parse(data) {
  var parser = new DOMParser();
  xmlDoc = parser.parseFromString(data,"text/xml");
  const num = xmlDoc.getElementsByTagName("title").length;
  for(var i = 0; i < num; i++) {
    const xTitle = xmlDoc.getElementsByTagName("title")[i];
    var title = document.createElement("p");
    title.appendChild(xTitle)
    container.appendChild(title);
  }
}

window.onload = initialize;
