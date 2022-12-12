/* This runs after a web page loads */

/* ---------------------- Global variables ---------------------- */
let body = document.body;
let isExtensionOn = false;
// holds the current highlighted text
let currentText = ""; 
let highlightedTexts = [];

/* ---------------------- Main Logic ---------------------- */
const interface = createInterface();
const title = addTitle(interface);
const toggle = addToggleButton(interface, title);
const desc = addDesc(interface);

/* ---------------------- Event listeners ---------------------- */

document.onmousedown = (event) => {
  const targ = event.target;
  if (!interface.contains(targ)) {
    if (isExtensionOn) {
      desc.innerText = "higlighting...";
    } else {
      desc.innerText = "";
    }
  }
}

document.onmouseup = (event) => {
  const targ = event.target;
  if (!interface.contains(targ)) {
    if (isExtensionOn) {
      const selection = window.getSelection();

      // TODO Storing the text for when I extend the functionality
      currentText = selection.toString();
      if (currentText.length == 0) {
        desc.innerText = "nothing to highlight";
      } else {
        // TODO change the style of the highlighted text
        highlightSelection(selection);
        highlightedTexts.push(currentText);
        console.log("List of highlighted texts: ", highlightedTexts);
        desc.innerHTML = "highlighted!";
      }
    } else {
      desc.innerText = "";
    }
  }
}


/* ---------------------- DOM functions ---------------------- */
/* These functions only run once! */

// create & return an interface window
function createInterface() {
  // create a blank div
  const customInterface = document.createElement("div");
  // add styling
  customInterface.className = 'customInterface';
  // add to first child of body
  body.insertBefore(customInterface, body.firstChild);

  return customInterface;
}

// create the "Arc Highlighter: ON/OFF" element & add to interface
function addTitle(interface) {
  // create a title
  const title = document.createElement("p");
  title.className = "customTitle";
  title.innerText = "Arc Highlighter: " + (isExtensionOn ? "ON ✅" : "OFF ❌");
  interface.appendChild(title);

  return title;
}

// create a description element & add to interface
function addDesc(interface) {
  // create a description
  const desc = document.createElement("p");
  desc.className = "customDesc";
  desc.innerText = isExtensionOn ? "<no text>" : "";
  interface.appendChild(desc);

  return desc;
}

// create a toggle on/off button & add to interface
// ... toggle will affect all elements passed in as parameters
function addToggleButton(interface, title) {
  // create a button
  const button = document.createElement("button");
  button.innerText = "Toggle"
  button.className = "toggleButton";

  // toggle ON/OFF
  button.onclick = () => {
    isExtensionOn = !isExtensionOn;
    title.innerText = "Arc Highlighter: " + (isExtensionOn ? "ON ✅" : "OFF ❌");
    if (!isExtensionOn) {
      desc.innerText = "<no text>";
    } else {
      desc.innerText = "";
    }
  }

  interface.appendChild(button);

  return button;
}

/* ---------------------- Helper functions ---------------------- */
function highlightSelection(selectionObject) {
  console.log("---------HIGHLIGHTED-------------");
  console.log("Website: " + selectionObject.anchorNode.baseURI);
  console.log("Text: " + selectionObject.toString());

  // Get a Range object from selection
  const selectionRange = selectionObject.getRangeAt(0);
  const start = selectionRange.startContainer;
  const end = selectionRange.endContainer;

  if (start.nodeName == "#text" && end.nodeName == "#text") {
    console.log("Start Node: ", start.parentNode);
    console.log("End Node: ", end.parentNode);

    let nodes = getNodesBetween(start.parentNode, end.parentNode);
    console.log("These are the selected nodes: ", nodes);

    /**
     * intended result: 
     * before: 
     *    <p>Lorem ipsum dolor sit amet, consectetur</p>
     * after: 
     *    <p>Lorem <div className="highlighted">ipsum</div> dolor sit amet, consectetur</p>
    */
    const replacement = document.createElement("div");
    replacement.innerText = selectionObject.toString();
    replacement.classList.add("highlighted");
    selectionRange.deleteContents();
    selectionRange.insertNode(replacement);
    window.getSelection().empty();
  }
  console.log("---------------------------------");
}

function getNodesBetween(startNode, endNode) {
  let nodes = [];
  const startNodeAncestor = startNode.parentNode;
  const endNodeAncestor = endNode.parentNode;
  const hasCommonAncestor = startNodeAncestor == endNodeAncestor;
  if (hasCommonAncestor) {
    const ancestor = startNodeAncestor;
    console.log("Ancestor: ", ancestor);
    // iterate from startNode to endNode
    const startIndex = Array.from(ancestor.children).indexOf(startNode);
    const endIndex = Array.from(ancestor.children).indexOf(endNode);
    // console.log("Looping from ", startIndex, " to ", endIndex);
    for (let i = startIndex; i <= endIndex; ++i) {
      nodes.push(ancestor.children[i]);
    }
  } else {
    console.log("No common ancestors..! Try highlight in smaller pieces");
  }
  return nodes;
}


