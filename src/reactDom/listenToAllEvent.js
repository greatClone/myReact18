import SynctheticEvent from "./synctheticEvent";
import { HostComponent } from "./workTags";

const allEvent = ["click", "keyDown"];

// 注册
function listenToAllEvent(container) {
  allEvent.forEach((eventName) => {
    const listener = dispatchEvent.bind(null, eventName);
    container.addEventListener(eventName, listener);
  });
}

// 触发
function dispatchEvent(eventName, nativeEvent) {
  // 合成事件
  const synctheticEvent = new SynctheticEvent(nativeEvent);
  // 获取listener
  const listeners = accumulateSinglePhaseListeners(nativeEvent, eventName);
  // 执行
  listeners.forEach((listen) => {
    listen(synctheticEvent);
  });
}

// 冒泡收集
function accumulateSinglePhaseListeners(nativeEvent, eventName) {
  const listeners = [];
  let targetFiber = nativeEvent.target.__reactFiber;
  while (targetFiber) {
    const { tag, stateNode } = targetFiber;
    if (tag === HostComponent && stateNode) {
      const listenerName = `on${eventName[0].toUpperCase()}${eventName.slice(
        1
      )}`;
      const props = stateNode.__reactProps;
      const listener = props[listenerName];
      if (listener) {
        listeners.push(listener);
      }
    }

    targetFiber = targetFiber.return;
  }
  return listeners;
}

export { listenToAllEvent };
