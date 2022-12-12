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
const colorPicker = addComponents(interface, title);
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
      // get selected text and perform action! 
      const selection = window.getSelection();
      currentText = selection.toString();
      if (currentText.length == 0) {
        desc.innerText = "nothing to highlight";
      } else {
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

colorPicker.onchange = (event) => {
  console.log("Changing color to: ", event.target.value);
  document.getElementsByTagName('html')[0].style.setProperty('--customHighlighterColor', event.target.value);
}


/* ---------------------- DOM functions ---------------------- */
/* These functions only run once! */

/**
 * create & return an interface window
 */
function createInterface() {
  // create a blank div
  const customInterface = document.createElement("div");
  // add styling
  customInterface.className = 'customInterface';
  // add to first child of body
  body.insertBefore(customInterface, body.firstChild);

  return customInterface;
}

/**
 * create the "Arc Highlighter: ON/OFF" element & add to interface
 */
function addTitle(interface) {
  // create a title
  const title = document.createElement("p");
  title.className = "customTitle";
  title.innerText = "Arc Highlighter: " + (isExtensionOn ? "ON ✅" : "OFF ❌");
  interface.appendChild(title);

  return title;
}

/**
 * create a description element & add to interface
 */
function addDesc(interface) {
  // create a description
  const desc = document.createElement("p");
  desc.className = "customDesc";
  desc.innerText = isExtensionOn ? "<no text>" : "";
  interface.appendChild(desc);

  return desc;
}

/**
 * addComponents(interface, title)
 * 
 * add the toggle on/off button and color picker to interface
 * and update the title innerText status
 */
function addComponents(interface, title) {
  // create a button
  const toggleButton = document.createElement("button");
  toggleButton.innerText = "Toggle"
  toggleButton.className = "clickable";

  // create a color picker
  const colorPicker = document.createElement("input");
  colorPicker.type = "color";
  colorPicker.value = "#c2f4fd";
  colorPicker.className = "clickable";

  // toggle ON/OFF
  toggleButton.onclick = () => {
    isExtensionOn = !isExtensionOn;
    title.innerText = "Arc Highlighter: " + (isExtensionOn ? "ON ✅" : "OFF ❌");
    if (!isExtensionOn) {
      desc.innerText = "<no text>";
    } else {
      desc.innerText = "";
    }
  }

  interface.appendChild(toggleButton);
  interface.appendChild(colorPicker);

  return colorPicker;
}

/* ---------------------- Helper functions ---------------------- */
/**
 * Highlights the selection by creating a replacement node
 */
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

