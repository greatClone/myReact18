import { appendChild } from "./domOperations";

function commitRoot(root) {
  const finishedWork = root.finishedWork;
  const parentNode = root.containerInfo;
  let childFiber = finishedWork.child;
  let node = null;
  while (!node) {
    node = childFiber.stateNode;
    childFiber = childFiber.child;
  }
  appendChild(parentNode, node);
}

export { commitRoot };
