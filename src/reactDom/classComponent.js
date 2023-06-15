import { reconcileChildren } from "./beginWork";
import { enqueueUpdate, scheduleUpdateOnFiber } from "./updateContainer";

const classComponentUpdater = {
  enqueueSetState(inst, partialState) {
    const update = {
      payload: partialState,
    };
    const fiber = inst["_reactInternal"];
    const root = enqueueUpdate(fiber, update);
    scheduleUpdateOnFiber(root);
  },
};
// 构造
function constructClassInstance(workInProgress) {
  const { type, pendingProps } = workInProgress;
  const instance = new type(pendingProps);
  instance.updater = classComponentUpdater;
  workInProgress.stateNode = instance;
  instance["_reactInternal"] = workInProgress;
}

function mountClassInstance(workInProgress) {}

function finishClassInstance(workInProgress) {
  const instance = workInProgress.stateNode;
  const nextChildren = instance.render();
  workInProgress.child = reconcileChildren(workInProgress, nextChildren);
  return workInProgress.child;
}

export { constructClassInstance, mountClassInstance, finishClassInstance };
