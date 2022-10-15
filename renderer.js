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
  console.log("should add")
  console.log(rssURL.value)

  var feedLink = document.createElement("li");
  feedLink.appendChild(document.createTextNode(rssName.value + "\n"));
  feedLinks.appendChild(feedLink);
  rssName.value = "";
  rssURL.value = "";
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

