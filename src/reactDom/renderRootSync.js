import beginWork from "./beginWork";

let workInProgress = null;
function renderRootSync(root) {
  // 生成 workInProgress
  workInProgress = { ...root.current };
  workInProgress.alternate = root.current;
  root.current.alternate = workInProgress;

  // 开始循环
  while (workInProgress) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  let next = beginWork(unitOfWork);
  if (!next) {
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
}

function completeUnitOfWork(unitOfWork) {
  console.log(1122, unitOfWork);
  workInProgress = null;
}

export default renderRootSync;
