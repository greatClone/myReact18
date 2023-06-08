import { HostRoot } from "./workTags";
import { renderRootSync } from "./renderRootSync";
import { commitRoot } from "./commitRoot";
import { Fiber } from "./fiber";
import { listenToAllEvent } from "./listenToAllEvent";
import { flushSyncQueue } from "./syncTaskQueue";
import { updateContainer } from "./updateContainer";

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
  });

  root.current = hostRootFiber;
  hostRootFiber.stateNode = root;

  listenToAllEvent(container);

  flushSync(() => {
    updateContainer(element, root);
  });
}

function flushSync(fn) {
  try {
    fn();
  } finally {
    flushSyncQueue();
  }
}

export { render };
