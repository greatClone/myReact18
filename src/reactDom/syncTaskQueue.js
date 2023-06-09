let syncQueue = null;

function scheduleCallback(callback) {
  if (!syncQueue) {
    syncQueue = [callback];
  } else {
    syncQueue.push(callback);
  }
}

function flushSyncQueue() {
  if (syncQueue) {
    syncQueue.forEach((task) => {
      task();
    });
  }
  syncQueue = null;
}

export { scheduleCallback, flushSyncQueue };
