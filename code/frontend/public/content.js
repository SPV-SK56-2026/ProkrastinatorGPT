let iframe = null;

function createIndex(id) {
  console.log(id);
  iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL("index.html");
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
    width:30%;
   
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
  console.log(id);
  if (message.type === "TOGGLE_IFRAME") {
    if (iframe) {
      iframe.remove();
      iframe = null;
    } else {
      console.log(id);
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