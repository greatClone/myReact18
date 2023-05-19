function createTextNode(text) {
  return document.createTextNode(text);
}

function createElement(tag) {
  return document.createElement(tag);
}

function appendChild(parentNode, node) {
  parentNode.appendChild(node);
}

export { createTextNode, createElement, appendChild };
