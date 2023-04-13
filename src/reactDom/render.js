import FiberNode from "./fiberNode";
import { HostRoot } from "./workTags";

let workInProgress = {};

function performUnitOfWork(unitOfWork) {}

function renderRootSync(root) {
  root.finishedWork = null;
  workInProgress = root.current;
  workInProgress.alternate = root.current;
  root.current.alternate = workInProgress;

  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function updateContainer(element, root) {
  // 生成更新对象
  const update = {
    payload: element,
    next: null,
  };
  // 入队更新
  update.next = update;
  const fiberNode = root.current;
  fiberNode.updateQueue.shared.interleaved = update;

  // 同步渲染
  renderRootSync(root);
  root.finishedWork = root.current.alternate;
}

export default function render(element, container) {
  console.log(111, element, container);
  // 生成root
  const rootFiber = new FiberNode(HostRoot);
  rootFiber.updateQueue = {
    shared: {
      pending: null,
      interleaved: null,
    },
  };
  const root = {
    containerInfo: container,
    current: rootFiber,
  };
  rootFiber.stateNode = root;
  container._reactContainer = root;

  // 更新
  updateContainer(element, root);
}
