import { HostRoot } from "./workTags";
import { renderRootSync } from "./renderRootSync";
import { commitRoot } from "./commitRoot";
import { Fiber } from "./fiber";

function render(element, container) {
  // 生成根对象
  const root = {
    containerInfo: container,
    finishedWork: null,
    current: null,
  };
  // 生产根fiber
  const hostRootFiber = new Fiber({
    tag: HostRoot,
    props: element,
  });

  root.current = hostRootFiber;
  hostRootFiber.stateNode = root;

  // 生成dom
  renderRootSync(root);

  root.finishedWork = root.current.alternate;

  // 挂载
  commitRoot(root);
}

export { render };
