import {checkNameExists, checkURLExists, constructError} from './error.js'

const information = document.getElementById('info');
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

const func = async () => {
    const response = await window.versions.ping()
    console.log(response) // prints out 'pong'
  }
  
  func()

const add_feed_button = document.getElementById('add_feed_button');
const add_feed_modal = document.getElementById('add_feed_modal');
const delete_feed_modal = document.getElementById('delete_feed_modal');
const add_link_button = document.getElementById('add_link_button');
const rss_name = document.getElementById('rss_name');
const rss_url = document.getElementById('rss_url');
var feed_list = document.getElementById('feed_list');

var container = document.getElementById('container');

function initialize() {
  add_feed_button.addEventListener('click', () => {
    add_feed_modal.style.display = "block";
  });
  
  add_link_button.addEventListener('click', () => {
    if(!(checkNameExists(rss_name.value))) {
      console.log("error");
    } else {
      addFeed();
      hideModal();
    }
  });

  for(let i = 0; i < 3; i++) {
    var close_button = document.getElementsByClassName("close_modal")[i];
    close_button.addEventListener('click', () => {
      hideModal();
      fix_delete_feed_button();
    });
  }

  var cancel_delete_button = document.getElementById("cancel_delete_button");
  cancel_delete_button.addEventListener('click', () => {
    hideModal();
    fix_delete_feed_button();
  });

  add_listeners();
}

/* ADD FEED */
/* ############################################################################################### */
function addFeed () {
  var json_feed = {
    "links": [
    ],
    "html": "<li>" + rss_name.value + "<button class=\"edit_button\" title=\"Edit\">" +
    "<img class=\"feed_button_icon\" src=\"./images/edit.png\" unselectable=\"on\"></button>" +
    "<button class=\"load_button\" title=\"Load\" name=\"" + rss_url.value + "\" value=\"" + rss_name.value + "\">" +
    "<img class=\"feed_button_icon\" src=\"./images/load.png\" unselectable=\"on\"></button>" +
    "<button class=\"delete_button\" title=\"Delete\" name=\"" + rss_name.value + "\">" +
    "<img class=\"feed_button_icon\" src=\"./images/delete.png\" unselectable=\"on\"></button>" + "</li>",
    "name": rss_name.value,
    "url": rss_url.value,
  }


  if(localStorage.getItem("rss_feeds")) {
    localStorage.setItem("rss_feeds", 
    localStorage.getItem("rss_feeds").substring(0, localStorage.getItem("rss_feeds").length - 1))
    localStorage.setItem("rss_feeds", localStorage.getItem("rss_feeds") + "," + JSON.stringify(json_feed) + "]")
  } else {
    localStorage.setItem("rss_feeds", "[" + JSON.stringify(json_feed) + "]")
  }
  save_feeds()
  add_listeners()

  rss_name.value = "";
  rss_url.value = "";
}
/* ############################################################################################### */

/* EDIT FEED */
/* ############################################################################################### */
function editFeed() {
  console.log("edit");
}
/* ############################################################################################### */

/* LOAD FEED */
/* ############################################################################################### */
function loadFeed(event) {

    while(container.firstChild) {
      container.removeChild(container.lastChild)
    }
  const load = event.target;
  const URL = load.name;
  const name = load.value;
  fetch(URL)
    .then(response => response.text())
    .then(data => parse(data, name, URL))
}

function parse(data, name, link) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(data,"text/xml");
  const num_items = xmlDoc.getElementsByTagName("item").length;
  const num_entries = xmlDoc.getElementsByTagName("entry").length;
  if(num_items) {
    for(let i = 0; i < num_items; i++) {
      var divider = document.createElement("div");
      divider.setAttribute("class", "feed_data")
      const xItem = xmlDoc.getElementsByTagName("item")[i];

      divider.appendChild(handleItem(xItem, name, link));
      if(divider.childNodes[0].className != "removable") {
        container.appendChild(divider);
      }
    }
  }
  if(num_entries) {
    for(let i = 0; i < num_entries; i++) {
      var divider = document.createElement("div");
      divider.setAttribute("class", "feed_data")
      const xEntry = xmlDoc.getElementsByTagName("entry")[i];
  
      divider.appendChild(handleItem(xEntry, name, link));
      if(divider.childNodes[0].className != "removable") {
        container.appendChild(divider);
      }
    }
  }
  pull_history(link);
}

function handleItem(item, name, link) {
  var xName = document.createElement("p");
  xName.innerHTML = name;
  const children = item.childNodes;
  var mark_read_button = document.createElement("button");
  mark_read_button.setAttribute("class", "mark_read_button");
  var icon_mark = document.createElement("img");
  icon_mark.setAttribute("class", "feed_button_icon");
  icon_mark.setAttribute("src", "./images/mark.png");
  icon_mark.setAttribute("unselectable", "on");
  mark_read_button.appendChild(icon_mark);
  mark_read_button.setAttribute("title", "Mark Read/Unread");

  var sub_divider = document.createElement("div");
  sub_divider.appendChild(xName);
  for(let i = 0; i < children.length; i++) {
    const child = children.item(i)
    switch (child.tagName) {
      case "title":
        var xTitle = document.createElement("p");
        xTitle.setAttribute("class", "feed_title");
        xTitle.innerHTML = child.innerHTML;
        sub_divider.appendChild(xTitle);
        sub_divider.appendChild(mark_read_button);
        break;
      case "guid":
        var xGuid = document.createElement("a");
        xGuid.setAttribute("class", "feed_guid");
        xGuid.setAttribute("target", "_blank");
        xGuid.setAttribute("href", child.innerHTML);
        xGuid.innerHTML = child.innerHTML;
        sub_divider.appendChild(xGuid);
        break;
      case "description":
        var xDescription = document.createElement("p");
        xDescription.setAttribute("class", "feed_description");
        xDescription.innerHTML = child.innerHTML;
        sub_divider.appendChild(xDescription);
        break;
      case "pubDate":
        var xPubDate = document.createElement("p");
        xPubDate.setAttribute("class", "feed_pubDate");
        xPubDate.innerHTML = child.innerHTML;
        sub_divider.appendChild(xPubDate);
        break;
      case "link":
        var xGuid = document.createElement("a");
        xGuid.setAttribute("class", "feed_guid");
        xGuid.setAttribute("target", "_blank");
        xGuid.setAttribute("href", child.getAttribute("href"));
        xGuid.innerHTML = child.getAttribute("href");
        sub_divider.appendChild(xGuid);
        break;
      case "published":
        var xPubDate = document.createElement("p");
        xPubDate.setAttribute("class", "feed_pubDate");
        xPubDate.innerHTML = child.innerHTML;
        sub_divider.appendChild(xPubDate);
        break;
    }
  }
  if(localStorage[link]) {
    if(localStorage[link].includes(sub_divider.getElementsByClassName("feed_title")[0].innerHTML)) {
      sub_divider.remove();
      var temp = document.createElement("div");
      temp.setAttribute("class", "removable")
      return temp
    }
  }
  return sub_divider
}

function mark(event) {
  var parentElement = event.target.parentElement;
  if(parentElement.className == "read") {
    parentElement.setAttribute("class", "unread");
  } else {
    parentElement.setAttribute("class", "read");
  }
  localStorage.setItem(event.target.link, container.innerHTML)
}
/* ############################################################################################### */

/* DELETE FEED */
/* ############################################################################################### */
function show_delete_modal(event) {
  var delete_feed_button = document.createElement("button");
  delete_feed_button.setAttribute("id", "delete_feed_button");
  delete_feed_button.setAttribute("class", "danger_button")
  delete_feed_button.innerText = "Delete";
  var div = document.getElementById("delete_modal_content");
  div.appendChild(delete_feed_button);

  var h3 = document.getElementById("danger_message");
  h3.innerHTML = "Are you sure you want to delete the feed " + "<u>" + event.target.name + "</u>" + "?";

  delete_feed_modal.style.display = "block";
  delete_feed(event);
}

function delete_feed(event) {
  var parentElement = event.target.parentElement;
  var delete_feed_button = document.getElementById("delete_feed_button");
  delete_feed_button.addEventListener('click', () => {
  parentElement.remove();
  container.innerHTML = "";

  var feed_items = JSON.parse(localStorage.getItem("rss_feeds"))
  for(let i = 0; i < feed_items.length; i++) {
    if(event.target.name == feed_items[i].name) {
      feed_items.splice(i, 1);
    }
    if(feed_items.length == 0) {
      localStorage.removeItem("rss_feeds")
    }
  }

  if(localStorage.getItem("rss_feeds")) {
    localStorage.setItem("rss_feeds", JSON.stringify(feed_items))
  }

  save_feeds()
  add_listeners()
  hideModal();
  fix_delete_feed_button();
  });
}

function fix_delete_feed_button () {
  var delete_feed_button = document.getElementById("delete_feed_button");
  if(delete_feed_button) {
    delete_feed_button.remove();
  }
}
/* ############################################################################################### */

/* UTILITIES */
/* ############################################################################################### */
function hideModal() {
  add_feed_modal.style.display = "none";
  delete_feed_modal.style.display = "none";
}

function add_listeners() {
  if (localStorage.getItem("rss_feeds")) {
    save_feeds()
    var edit_buttons = document.getElementsByClassName("edit_button");
    for(let i = 0; i < edit_buttons.length; i++) {
        edit_buttons[i].addEventListener("click", editFeed);
    }
    var load_buttons = document.getElementsByClassName("load_button");
    for(let j = 0; j < load_buttons.length; j++) {
        load_buttons[j].addEventListener("click", loadFeed);
    }
    var delete_buttons = document.getElementsByClassName("delete_button");
    for(let k = 0; k < delete_buttons.length; k++) {
        delete_buttons[k].addEventListener("click", show_delete_modal);
    }
  }
}

function save_feeds() {
  var feed_items = JSON.parse(localStorage.getItem("rss_feeds"))
  feed_list.innerHTML = ""
  if(feed_items) {
    for(let i = 0; i < feed_items.length; i++) {
      feed_list.innerHTML += feed_items[i].html
    }
  }
}

function pull_history(link) {
  //if localStorage[link] has title that is not found in container.innerHTML, remove item from localStorage[link]
  container.innerHTML += localStorage[link]

    var mark_read_buttons = document.getElementsByClassName("mark_read_button");
    for(let i = 0; i < mark_read_buttons.length; i++) {
        mark_read_buttons[i].link = link
        mark_read_buttons[i].addEventListener("click", mark);
    }
}

function save_history(container) {

}
/* ############################################################################################### */


window.onload = initialize;

window.onclick = function(event) {
  if ((event.target == add_feed_modal) || event.target == delete_feed_modal) {
   hideModal();
   fix_delete_feed_button();
  }
}