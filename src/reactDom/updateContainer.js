import { scheduleCallback } from "./syncTaskQueue";
import { performSyncWorkOnRoot } from "./renderRootSync";

function updateContainer(element, container) {
  // 生成更新
  const update = {
    payload: element,
  };

  // 挂载
  const root = enqueueUpdate(container.current, update);

  // 调度
  scheduleUpdateOnFiber(container);
}

function enqueueUpdate(fiber, update) {
  fiber.updateQueue.share.pending = update;
  let returnFiber = fiber;
  while (returnFiber.return) {
    returnFiber = returnFiber.return;
  }
  return returnFiber.stateNode;
}

// 调度入口
function scheduleUpdateOnFiber(root) {
  ensureRootIsScheduled(root);
}

// 调度
function ensureRootIsScheduled(root) {
  scheduleCallback(performSyncWorkOnRoot.bind(null, root));
}

export { updateContainer, enqueueUpdate, scheduleUpdateOnFiber };
