import { beginWork } from "./beginWork";
import { completeWork } from "./completeWork";
import { commitRoot } from "./commitRoot";

let workInProgress = null;
function renderRootSync(root) {
  // 生成工作单元
  workInProgress = { ...root.current };
  workInProgress.alternate = root.current;
  root.current.alternate = workInProgress;

  // 循环
  while (workInProgress) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  const next = beginWork(unitOfWork);

  if (!next) {
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
}

function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork;
  while (completedWork) {
    // 完成当前节点
    completeWork(completedWork);
    // 是否有兄弟节点，begin
    if (completedWork.sibling) {
      workInProgress = completedWork.sibling;
      return;
    }
    // 完成父元素
    workInProgress = completedWork = completedWork.return;
  }
}

function performSyncWorkOnRoot(root) {
  // 生成dom
  renderRootSync(root);

  root.finishedWork = root.current.alternate;

  // 挂载
  commitRoot(root);
}

export { renderRootSync, performSyncWorkOnRoot };
