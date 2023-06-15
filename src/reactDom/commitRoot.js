import { appendChild } from "./domOperations";
import { HostComponent } from "./workTags";

function commitRoot(root) {
  const finishedWork = root.finishedWork;
  const parentNode = root.containerInfo;
  let childFiber = finishedWork.child;
  let node = null;
  while (!node) {
    if (childFiber.tag === HostComponent) {
      node = childFiber.stateNode;
    }
    childFiber = childFiber.child;
  }
  appendChild(parentNode, node);
}

export { commitRoot };
