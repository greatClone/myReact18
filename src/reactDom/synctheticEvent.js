class SynctheticEvent {
  constructor(nativeEvent) {
    this.nativeEvent = nativeEvent;

    for (const [k, v] of Object.entries(nativeEvent)) {
      this[k] = v;
    }
  }

  preventDefault() {}

  stopPropagation() {}
}

export default SynctheticEvent;
