const information = document.getElementById('info');
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

const func = async () => {
    const response = await window.versions.ping()
    console.log(response) // prints out 'pong'
  }
  
  func()

const addFeedBtn = document.getElementById('addFeedBtn');
const addFeedModal = document.getElementById('addFeedModal');
var span = document.getElementsByClassName("close")[0];
addFeedBtn.addEventListener('click', () => {
    console.log("called")
    addFeedModal.style.display = "block";
});

span.addEventListener('click', () => {
    addFeedModal.style.display = "none";
});

window.onclick = function(event) {
    if (event.target == addFeedModal) {
     addFeedModal.style.display = "none";
    }
  }

