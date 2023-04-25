import { HostComponent, HostRoot, HostText } from "./workTags";
import { REACT_ELEMENT, REACT_TEXT } from "../shared/constants";
import FiberNode from "./fiber";

function beginWork(workInProgress) {
  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(workInProgress);
    case HostComponent:
      return updateHostComponent(workInProgress);
    case HostText:
      return updateHostText(workInProgress);
    default:
      return null;
  }
}

function updateHostRoot(workInProgress) {
  const nextChildren = workInProgress.pendingProps;
  workInProgress.child = reconcileChildren(workInProgress, nextChildren);
  return workInProgress.child;
}

function updateHostComponent(workInProgress) {
  const nextChildren = workInProgress.pendingProps.children;
  workInProgress.child = reconcileChildren(workInProgress, nextChildren);
  return workInProgress.child;
}

function updateHostText(workInProgress) {
  return null;
}

function reconcileChildren(workInProgress, nextChildren) {
  if (nextChildren.$$typeof === REACT_ELEMENT) {
    return reconcileSingleElement(workInProgress, nextChildren);
  }
  if (Array.isArray(nextChildren)) {
    return reconcileChildrenArray(workInProgress, nextChildren);
  }
}

function reconcileSingleElement(workInProgress, element) {
  const created = new FiberNode({
    tag: getTag(element),
    props: element.props,
    key: element.key,
    type: element.type,
  });
  created.return = workInProgress;
  return created;
}

function reconcileChildrenArray(workInProgress, nextChildren) {
  let firstChildren = null;
  let prevFiber = null;
  nextChildren.forEach((child) => {
    const newFiber = reconcileSingleElement(workInProgress, child);
    if (!prevFiber) {
      firstChildren = newFiber;
    } else {
      prevFiber.sibling = newFiber;
    }
    prevFiber = newFiber;
  });
  return firstChildren;
}

function getTag(element) {
  if (element.$$typeof === REACT_ELEMENT && typeof element.type === "string") {
    return HostComponent;
  }
  if (element.$$typeof === REACT_TEXT) {
    return HostText;
  }
}

export default beginWork;
