let iframe = null;

function createIndex(id) {

  const description = encodeURIComponent(document.querySelector('.activity-description')?.innerText?.trim() || '');
  const timeRemaining = encodeURIComponent(document.querySelector('.timeremaining.cell.c1.lastcol')?.innerText?.trim() || '');

  iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL("index.html") 
    + `?assignmentId=${encodeURIComponent(id)}`
    + `&description=${description}`
    + `&timeRemaining=${timeRemaining}`;

  iframe.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    height: 150px;
    max-height: 90vh;
    border: none;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    z-index: 999999;
    width: 30%;
  `;
  document.body.appendChild(iframe);
}

function createIframe() {
  iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL("index.html") + "?noAssignment=true";
  iframe.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    height: 0px;
    max-height: 90vh;
    border: none;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    z-index: 999999;
    overflow: hidden;
  `;
  document.body.appendChild(iframe);
}


const params = new URLSearchParams(window.location.search);
id =""
if (params.get("id")) {
  id = params.get("id");
  createIndex(id);
}


chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "TOGGLE_IFRAME") {
    if (iframe) {
      iframe.remove();
      iframe = null;
    } else {
      if(id == "" || id == null)
        createIframe()
      else
        createIndex(id)
    }
  }
});


window.addEventListener("message", (event) => {
  if (event.data?.type === "CLOSE_IFRAME") {
    iframe?.remove();
    iframe = null;
  }
});

window.addEventListener("message", (event) => {
  if (event.data?.type === "RESIZE_IFRAME") {
    if (iframe) iframe.style.height = event.data.height + "px";
  }
  if (event.data?.type === "CLOSE_IFRAME") {
    iframe?.remove();
    iframe = null;
  }
});