import Fiber from "./fiber";
import { HostRoot } from "./workTags";
import renderRootSync from "./renderRootSync";
import commitRoot from "./commitRoot";

function render(element, container) {
  // 生成一个全局的对象、根fiber
  const root = {
    containerInfo: container,
    finishedWork: null,
  };

  const hostRootFiber = new Fiber({
    tag: HostRoot,
    props: element,
  });

  root.current = hostRootFiber;
  hostRootFiber.stateNode = root;

  // 生成 dom 树
  renderRootSync(root);
  // 挂载
  commitRoot(root);
}

export default render;
