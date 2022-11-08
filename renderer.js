import {checkNameExists, checkURLExists, constructError} from './error.js'

const information = document.getElementById('info');
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

const func = async () => {
    const response = await window.versions.ping()
    console.log(response) // prints out 'pong'
  }
  
  func()

const add_feed_button = document.getElementById('add_feed_button');
const load_all_button = document.getElementById('load_all_button');


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

  load_all_button.addEventListener("click", loadAll);
  
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
    "<img class=\"feed_button_icon\" src=\"./images/delete.png\" unselectable=\"on\"></button>" + 
    "<p class=\"unread_count\" name=" + rss_url.value + "></p></li>",
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
  const URL = event.target.name;
  fetch(URL)
    .then(response => response.text())
    .then(data => parse(data, URL))
}

function parse(data, URL) {
  var feed_items = JSON.parse(localStorage.getItem("rss_feeds"))
  for(let i = 0; i < feed_items.length; i++) {
    if(feed_items[i].url == URL) {
      feed_items[i].links.splice(0, feed_items[i].links.length)
    }
  }
  var parser = new DOMParser();
  var xml_doc = parser.parseFromString(data, "text/xml");
  const num_items = xml_doc.getElementsByTagName("item").length;
  const num_entries = xml_doc.getElementsByTagName("entry").length;
  if(num_items) {
    for(let i = 0; i < num_items; i++) {
      const xItem = xml_doc.getElementsByTagName("item")[i];
      parse_article(xItem, URL, feed_items)
    }
  }
  if(num_entries) {
    for(let i = 0; i < num_entries; i++) {
      const xEntry = xml_doc.getElementsByTagName("entry")[i];
      parse_article(xEntry, URL, feed_items)
    }
  }
  save_articles(feed_items, URL)
  display_articles(URL)
  count_unread(URL)
  mark_listeners()
}

function parse_article(article, URL, feed_items) {
  var article_title, article_link, article_description, article_published
  for(let i = 0; i < article.childNodes.length; i++) {
    switch (article.childNodes[i].tagName) {
      case "title":
        article_title = article.childNodes[i].innerHTML
        break;
      case "guid":
        article_link = article.childNodes[i].innerHTML
        break;
      case "description":
        article_description = article.childNodes[i].innerHTML
        break;
      case "pubDate":
        article_published = article.childNodes[i].innerHTML
        break;
      case "link":
        article_link = article.childNodes[i].getAttribute("href")
        break;
      case "published":
        article_published = article.childNodes[i].innerHTML
        break;
    }
  }
    for(let i = 0; i < feed_items.length; i++) {
      if(feed_items[i].url == URL) {
        var article_item = {"title": article_title, "link": article_link, "description": article_description,
        "published": article_published, "mark": "unread"}
          feed_items[i].links.push(article_item)
      }
    }
}

function display_articles(link) {
  var feed_items = JSON.parse(localStorage.getItem("rss_feeds"))
  for(let i = 0; i < feed_items.length; i++) {
    if(feed_items[i].url == link) {
      for(let j = 0; j < feed_items[i].links.length; j++) {
        container.innerHTML += "<div class=\"feed_data\">" + 
        "<div class=\"" + feed_items[i].links[j].mark + "\">" +
        "<p>" + feed_items[i].name + "</p>" +
        "<button class=\"mark_read_button\" title=\"Mark Read/Unread\">" + 
        "<img class=\"feed_button_icon\" src=\"./images/mark.png\" unselectable=\"on\"></button>" +
        "<p class=\"feed_title\">" + feed_items[i].links[j].title + "</p>" +
        "<a class=\"feed_guid\" target=\"_blank\" href=" + feed_items[i].links[j].link +">" + feed_items[i].links[j].link +"</a>" +
        "<p class=\"feed_description\">" + feed_items[i].links[j].description +"</p>" +
        "<p class=\"feed_pubDate\">" + feed_items[i].links[j].published +"</p>" +
        "</div></div>"
      }
    }
  }
}

function count_unread(link) {
  var num_unread = 0;
  var feed_items = JSON.parse(localStorage.getItem("rss_feeds"))
  for(let i = 0; i < feed_items.length; i++) {
    if(feed_items[i].url == link) {
      for(let j = 0; j < feed_items[i].links.length; j++) {
        if(feed_items[i].links[j].mark == "unread") {
          num_unread++
        }
      }
      
    }
  }
  if(num_unread == 0) {
    feed_list.getElementsByClassName("unread_count")[link].innerHTML = ""
  } else {
    feed_list.getElementsByClassName("unread_count")[link].innerHTML = "(" + num_unread + ")"
  }

  
}

/* ############################################################################################### */

/* LOAD ALL */
/* ############################################################################################### */
function loadAll() {
  var load_buttons = feed_list.getElementsByClassName("load_button")
  for(let i = 0; i < load_buttons.length; i++) {
    load_buttons[i].click();
  }
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
    var mark_buttons = document.getElementsByClassName("mark_read_button");
    for(let l = 0; l < mark_buttons.length; l++) {
      mark_buttons[l].addEventListener("click", mark);
    }
  }
}

function mark_listeners() {
  var mark_buttons = document.getElementsByClassName("mark_read_button");
  for(let l = 0; l < mark_buttons.length; l++) {
    mark_buttons[l].addEventListener("click", mark);
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

function save_articles(data, link) {
  for(let i = 0; i < data.length; i++) {
    if(data[i].url == link) {
      var feed = JSON.parse(localStorage.getItem("rss_feeds"))
      for(let j = 0; j < feed.length; j++) {
        if(data[i].url == feed[j].url) {
          for(let k = 0; k < data[i].links.length; k++) {
            for(let l = 0; l < feed[j].links.length; l++) {
              if(feed[j].links[l].link == data[i].links[k].link) {
                data[i].links[k].mark = feed[j].links[l].mark
              }
            }
          }
        }
      }
    }
  }
  localStorage.setItem("rss_feeds", JSON.stringify(data))
}

function mark(event) {
  var temp_link = ""
  var parentElement = event.target.parentElement;
  if(parentElement.className == "read") {
    parentElement.setAttribute("class", "unread");
  } else {
    parentElement.setAttribute("class", "read");
  }
  var feed_data = JSON.parse(localStorage.getItem("rss_feeds"))
  let url = parentElement.getElementsByClassName("feed_guid")[0].href

  for(let i = 0; i < feed_data.length; i++) {
    for(let j = 0; j < feed_data[i].links.length; j++) {
      if(feed_data[i].links[j].link == url) {
        temp_link = feed_data[i].url
        feed_data[i].links[j].mark = parentElement.className
      }
    }
  }
  localStorage.setItem("rss_feeds", JSON.stringify(feed_data))
  count_unread(temp_link)
}
/* ############################################################################################### */


window.onload = initialize;

window.onclick = function(event) {
  if ((event.target == add_feed_modal) || event.target == delete_feed_modal) {
   hideModal();
   fix_delete_feed_button();
  }
}