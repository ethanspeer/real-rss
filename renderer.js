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

const container = document.getElementById('container');

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

  if (localStorage["feed_list"]) {
    feed_list.innerHTML = localStorage["feed_list"];
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

/* ADD FEED */
/* ############################################################################################### */
function addFeed () {
  var feed_name = document.getElementById("rss_name").value;
  var feed_text = document.createTextNode(feed_name);
  var li = document.createElement("li");
  var edit_button = document.createElement("button");
  var load_button = document.createElement("button");
  var delete_button = document.createElement("button");

  var icon_edit = document.createElement("img");
  var icon_load = document.createElement("img");
  var icon_delete = document.createElement("img");

  /* EDIT BUTTON */
  edit_button.setAttribute("class", "edit_button");
  edit_button.setAttribute("title", "Edit");
  edit_button.addEventListener("click", editFeed);
  /* LOAD BUTTON */
  load_button.setAttribute("class", "load_button");
  load_button.setAttribute("title", "Load");
  load_button.setAttribute("name", rss_url.value);
  load_button.setAttribute("value", feed_name);
  load_button.addEventListener("click", loadFeed);
  /* DELETE BUTTON */
  delete_button.setAttribute("class", "delete_button");
  delete_button.setAttribute("title", "Delete");
  delete_button.setAttribute("name", feed_name);
  delete_button.addEventListener("click", show_delete_modal);

  /* EDIT ICON */
  icon_edit.setAttribute("class", "feed_button_icon");
  icon_edit.setAttribute("src", "./images/edit.png");
  icon_edit.setAttribute("unselectable", "on");
  /* LOAD ICON */
  icon_load.setAttribute("class", "feed_button_icon");
  icon_load.setAttribute("src", "./images/load.png");
  icon_load.setAttribute("unselectable", "on");
  /* DELETE ICON */
  icon_delete.setAttribute("class", "feed_button_icon");
  icon_delete.setAttribute("src", "./images/delete.png");
  icon_delete.setAttribute("unselectable", "on");

  edit_button.appendChild(icon_edit);
  load_button.appendChild(icon_load);
  delete_button.appendChild(icon_delete);

  li.appendChild(feed_text);
  li.appendChild(edit_button);
  li.appendChild(load_button);
  li.appendChild(delete_button);
  feed_list.appendChild(li);

  save();
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
  console.log("load");
  container.innerHTML = "";
  const load = event.target;
  const URL = load.name;
  const name = load.value;
  fetch(URL)
    .then(response => response.text())
    .then(data => parse(data, name))
}

function parse(data, name) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(data,"text/xml");
  const num_items = xmlDoc.getElementsByTagName("item").length;
  const num_entries = xmlDoc.getElementsByTagName("entry").length;
  if(num_items) {
    for(let i = 0; i < num_items; i++) {
      var divider = document.createElement("div");
      divider.setAttribute("class", "feed_data")
      const xItem = xmlDoc.getElementsByTagName("item")[i];
  
      divider.appendChild(handleItem(xItem, name));
      container.appendChild(divider);
    }
  }
  if(num_entries) {
    for(let i = 0; i < num_entries; i++) {
      var divider = document.createElement("div");
      divider.setAttribute("class", "feed_data")
      const xEntry = xmlDoc.getElementsByTagName("entry")[i];
  
      divider.appendChild(handleItem(xEntry, name));
      container.appendChild(divider);
    }
  }
}

function handleItem(item, name) {
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
  mark_read_button.addEventListener('click', () => {
    var parentElement = mark_read_button.parentElement;
    console.log(parentElement);
    if(parentElement.style.backgroundColor != "white") {
      parentElement.style.backgroundColor = "white";
    } else {
      parentElement.style.backgroundColor = "#EAEDED";
    }
    console.log(parentElement)
    });

  var sub_divider = document.createElement("div");
  sub_divider.setAttribute("class", "feed_content");
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
  return sub_divider;
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
  save();
  container.innerHTML = "";
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

function save() {
  localStorage["feed_list"] = feed_list.innerHTML;
}
/* ############################################################################################### */


window.onload = initialize;

window.onclick = function(event) {
  if ((event.target == add_feed_modal) || event.target == delete_feed_modal) {
   hideModal();
   fix_delete_feed_button();
  }
}