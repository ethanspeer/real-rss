const information = document.getElementById('info');
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

const func = async () => {
    const response = await window.versions.ping()
    console.log(response) // prints out 'pong'
  }
  
  func()

const add_feed_button = document.getElementById('add_feed_button');
const add_feed_modal = document.getElementById('add_feed_modal');
const add_link_button = document.getElementById('add_link_button');
const rss_name = document.getElementById('rss_name');
const rss_url = document.getElementById('rss_url');
var feedLinks = document.getElementById('feedlinks');
var span = document.getElementsByClassName("close")[0];

const container = document.getElementById('container');


add_feed_button.addEventListener('click', () => {
    add_feed_modal.style.display = "block";
});

add_link_button.addEventListener('click', () => {
  addFeed();
  hideModal();
});

span.addEventListener('click', () => {
    hideModal();
});

window.onclick = function(event) {
    if (event.target == add_feed_modal) {
     hideModal();
    }
  }

function hideModal() {
  add_feed_modal.style.display = "none";
}

function initialize() {
  if (localStorage["feedList"]) {
    feedLinks.innerHTML = localStorage["feedList"];
    console.log(feedLinks.innerHTML);
    var edit_buttons = document.getElementsByClassName("edit_button");
    for(var i = 0; i < edit_buttons.length; i++) {
        edit_buttons[i].addEventListener("click", editFeed);
    }
    var load_buttons = document.getElementsByClassName("load_button");
    for(var j = 0; j < load_buttons.length; j++) {
        load_buttons[j].addEventListener("click", loadFeed);
    }
    var delete_buttons = document.getElementsByClassName("delete_button");
    for(var k = 0; k < delete_buttons.length; k++) {
        delete_buttons[k].addEventListener("click", deleteFeed);
    }
  }
}

function addFeed () {
  var feedName = document.getElementById("rss_name").value;
  var feedText = document.createTextNode(feedName);
  var li = document.createElement("li");
  var edit_button = document.createElement("button");
  var load_button = document.createElement("button");
  var delete_button = document.createElement("button");

  var icon_edit = document.createElement("img");
  var icon_load = document.createElement("img");
  var icon_delete = document.createElement("img");

  li.setAttribute("text-align", "center");
  edit_button.setAttribute("class", "edit_button");
  edit_button.setAttribute("title", "Edit");
  edit_button.addEventListener("click", editFeed);
  load_button.setAttribute("class", "load_button");
  load_button.setAttribute("title", "Load");
  load_button.setAttribute("name", rss_url.value);
  load_button.addEventListener("click", loadFeed);
  delete_button.setAttribute("class", "delete_button");
  delete_button.setAttribute("title", "Delete");
  delete_button.addEventListener("click", deleteFeed);

  icon_edit.setAttribute("src", "./images/edit.png");
  icon_edit.setAttribute("class", "feed-button-icon");
  icon_edit.setAttribute("unselectable", "on");
  icon_load.setAttribute("src", "./images/load.png");
  icon_load.setAttribute("class", "feed-button-icon");
  icon_load.setAttribute("unselectable", "on");
  icon_delete.setAttribute("src", "./images/delete.png");
  icon_delete.setAttribute("class", "feed-button-icon");
  icon_delete.setAttribute("unselectable", "on");

  edit_button.appendChild(icon_edit);
  load_button.appendChild(icon_load);
  delete_button.appendChild(icon_delete);
  li.appendChild(feedText);
  li.appendChild(edit_button);
  li.appendChild(load_button);
  li.appendChild(delete_button);
  feedLinks.appendChild(li);

  localStorage["feedList"] = feedLinks.innerHTML;
  rss_name.value = "";
  rss_url.value = "";
}

function editFeed() {
  console.log("edit");
}

function loadFeed(event) {
  console.log("load");
  container.innerHTML = "";
  const load = event.target;
  const URL = load.name;
  console.log(URL);
  fetch(URL)
    .then(response => response.text())
    .then(data => parse(data))
}

function parse(data) {
  console.log(data);
  var parser = new DOMParser();
  xmlDoc = parser.parseFromString(data,"text/xml");
  const num_entries = xmlDoc.getElementsByTagName("item").length;
  for(var i = 0; i < num_entries; i++) {
    var divider = document.createElement("div");
    divider.setAttribute("class", "feed_data")
    const xItem = xmlDoc.getElementsByTagName("item")[i];

    divider.appendChild(handleItem(xItem));
    container.appendChild(divider);
    console.log(container);
  }
}

function deleteFeed() {
  console.log("delete");
}

function handleItem(item) {
  const children = item.childNodes;
  var sub_divider = document.createElement("div");
  for(var i = 0; i < children.length; i++) {
    child = children.item(i)
    if(child.tagName == "title") {
      var xTitle = document.createElement("p");
      xTitle.setAttribute("class", "feed_title");
      xTitle.innerHTML = child.innerHTML;
      sub_divider.appendChild(xTitle);
    } else if(child.tagName == "guid") {
      var xGuid = document.createElement("a");
      xGuid.setAttribute("class", "feed_guid");
      xGuid.setAttribute("target", "_blank");
      xGuid.setAttribute("href", child.innerHTML);
      xGuid.innerHTML = child.innerHTML;
      sub_divider.appendChild(xGuid);
    } else if(child.tagName == "description") {
      var xDescription = document.createElement("p");
      xDescription.setAttribute("class", "feed_description");
      xDescription.innerHTML = child.innerHTML;
      sub_divider.appendChild(xDescription);
    } else if(child.tagName == "pubDate") {
      var xPubDate = document.createElement("p");
      xPubDate.setAttribute("class", "feed_pubDate");
      xPubDate.innerHTML = child.innerHTML;
      sub_divider.appendChild(xPubDate);
    }
  }
  return sub_divider;
}

window.onload = initialize;
