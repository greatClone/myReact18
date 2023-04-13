class FiberNode {
  constructor(tag) {
    this.tag = tag;

    // 链表关系
    this.return = null;
    this.sibling = null;
    this.child = null;

    // 更新队列
    this.updateQueue = null;

    this.alternate = null;
  }
}

export default FiberNode;
