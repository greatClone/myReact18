class Fiber {
  constructor({ tag, props, type, key }) {
    this.tag = tag;
    this.pendingProps = props;
    this.type = type;
    this.key = key;

    this.child = null;
    this.sibling = null;
    this.return = null;

    this.updateQueue = {
      share: {},
    };

    this.stateNode = null;
    this.alternate = null;
  }
}

export { Fiber };
