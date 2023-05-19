import {
  ClassComponent,
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from "./workTags";
import { appendChild, createElement, createTextNode } from "./domOperations";

function completeWork(workInProgress) {
  switch (workInProgress.tag) {
    case HostText:
      const textNode = createTextNode(workInProgress.pendingProps);
      workInProgress.stateNode = textNode;
      break;
    case HostComponent:
      // 生产dom
      const dom = createElement(workInProgress.type);
      // 挂载子元素
      appendAllChildren(dom, workInProgress);
      // 属性
      initialDomProps(dom, workInProgress);
      // 关联
      workInProgress.stateNode = dom;
      break;
    case FunctionComponent:
    case ClassComponent:
    case HostRoot:
    default:
      break;
  }
}

function appendAllChildren(dom, workInProgress) {
  let childFiber = workInProgress.child;
  while (childFiber) {
    const node = childFiber.stateNode;
    appendChild(dom, node);
    childFiber = childFiber.sibling;
  }
}

function initialDomProps(dom, workInProgress) {
  const { children, ...domProps } = workInProgress.pendingProps;
  for (const [k, v] of Object.entries(domProps)) {
    if (k === "style") {
      for (const [sk, sv] of Object.entries(v)) {
        dom.style[sk] = sv;
      }
      continue;
    }
    dom[k] = v;
  }
}

export { completeWork };
