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
  }
}

function addFeed () {
  var feedName = document.getElementById("rssname").value;
  var feedText = document.createTextNode(feedName);
  var li = document.createElement("li");
  var editBtn = document.createElement("button");
  var form = document.createElement("form");
  var linkBtn = document.createElement("button");
  var icon = document.createElement("img");
  var icon_link = document.createElement("img");


  li.setAttribute("text-align", "center");
  editBtn.setAttribute("class", "editBtn");
  editBtn.addEventListener("click", editFeed);
  linkBtn.setAttribute("class", "linkBtn");
  linkBtn.setAttribute("type", "submit");
  form.setAttribute("action", rssURL.value);
  form.setAttribute("method", "get");
  form.setAttribute("target", "_blank");
  icon.setAttribute("src", "./images/edit.png");
  icon.setAttribute("class", "edit");
  icon_link.setAttribute("src", "./images/link.png");
  icon_link.setAttribute("class", "edit");
  editBtn.appendChild(icon);
  linkBtn.appendChild(icon_link);
  form.appendChild(linkBtn);
  li.appendChild(feedText);
  li.appendChild(editBtn);
  li.appendChild(form);
  feedLinks.appendChild(li);

  localStorage["feedList"] = feedLinks.innerHTML
  rssName.value = "";
  rssURL.value = "";
}

function editFeed() {
  console.log("edit");
}

window.onload = initialize;
