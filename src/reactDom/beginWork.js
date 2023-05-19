// 工作单元，--> 子fiber
import {
  ClassComponent,
  FunctionComponent,
  getTag,
  HostComponent,
  HostRoot,
  HostText,
} from "./workTags";
import { Fiber } from "./fiber";

function beginWork(workInProgress) {
  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(workInProgress);
    case HostComponent:
      return updateHostComponent(workInProgress);
    case FunctionComponent:
      return updateFunctionComponent(workInProgress);
    case ClassComponent:
      return updateClassComponent(workInProgress);
    case HostText:
    default:
      return null;
  }
}

function updateFunctionComponent(workInProgress) {
  const { type, pendingProps } = workInProgress;
  const nextChildren = type(pendingProps);
  workInProgress.child = reconcileChildren(workInProgress, nextChildren);
  return workInProgress.child;
}

function updateClassComponent(workInProgress) {
  const { type, pendingProps } = workInProgress;
  const instance = new type(pendingProps);
  const nextChildren = instance.render();
  workInProgress.child = reconcileChildren(workInProgress, nextChildren);
  return workInProgress.child;
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

function reconcileChildren(workInProgress, nextChildren) {
  if (Array.isArray(nextChildren)) {
    return reconcileArrayChildren(workInProgress, nextChildren);
  } else {
    return reconcileSingElement(workInProgress, nextChildren);
  }
}

function reconcileSingElement(workInProgress, element) {
  const newFiber = new Fiber({
    tag: getTag(element),
    props: element.props,
    key: element.key,
    type: element.type,
  });

  newFiber.return = workInProgress;
  return newFiber;
}

function reconcileArrayChildren(workInProgress, nextChildren) {
  let firstFiber = null;
  let prevFiber = null;

  nextChildren.forEach((child) => {
    const newFiber = reconcileSingElement(workInProgress, child);
    if (!firstFiber) {
      firstFiber = newFiber;
    } else {
      prevFiber.sibling = newFiber;
    }
    prevFiber = newFiber;
  });

  return firstFiber;
}

export { beginWork };
