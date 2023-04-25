class FiberNode {
  constructor({ tag, props, key, type }) {
    this.tag = tag;
    this.key = key;
    this.type = type;

    this.pendingProps = props;

    this.child = null;
    this.sibling = null;
    this.return = null;

    this.alternate = null;
  }
}

export default FiberNode;
