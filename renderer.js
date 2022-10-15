const information = document.getElementById('info');
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

const func = async () => {
    const response = await window.versions.ping()
    console.log(response) // prints out 'pong'
  }
  
  func()

const addFeedBtn = document.getElementById('addFeedBtn');
const addFeedModal = document.getElementById('addFeedModal');
const addLinkBtn = document.getElementById('addlinkbtn');
const rssName = document.getElementById('rssname');
const rssURL = document.getElementById('rssurl');
var feedLinks = document.getElementById('feedlinks');
var span = document.getElementsByClassName("close")[0];
addFeedBtn.addEventListener('click', () => {
    console.log("called")
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
    var buttons = document.getElementsByClassName("listBtn");
    for(var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", editFeed);
    }
  }
}

function addFeed () {
  var feedName = document.getElementById("rssname").value;
  var feedText = document.createTextNode(feedName);
  var li = document.createElement("li");
  li.setAttribute("text-align", "center");
  var btn = document.createElement("button");
  btn.setAttribute("class", "listBtn");
  btn.addEventListener("click", editFeed);
  var icon = document.createElement("img");
  icon.setAttribute("src", "./images/edit.png");
  icon.setAttribute("class", "edit");
  btn.appendChild(icon);
  li.appendChild(feedText);
  li.appendChild(btn);
  feedLinks.appendChild(li);
  localStorage["feedList"] = feedLinks.innerHTML
  rssName.value = "";
  rssURL.value = "";
}

function editFeed() {
  console.log("edit");
  
}

window.onload = initialize;
