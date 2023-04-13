(function () {
  'use strict';

  const REACT_ELEMENT = Symbol('react_element');
  const REACT_TEXT = Symbol('react_text');

  function toObject(element) {
    if (typeof element === 'string' || typeof element === 'number') {
      return {
        content: element,
        $$typeof: REACT_TEXT,
      };
    }
    return element;
  }
  function createElement(type, config, ...children) {
    let key = null;
    let ref = null;
    let props = {};

    // key/ref
    if (config) {
      key = config.key || null;
      ref = config.ref || null;
      Reflect.deleteProperty(config, key);
      Reflect.deleteProperty(config, ref);
      // props,
      props = config;
    }
    if (children.length > 0) {
      props.children = children.map((child) => toObject(child));
    }
    // children

    return {
      type,
      key,
      ref,
      props,
      $$typeof: REACT_ELEMENT,
    };
  }

  class Component {
    constructor(props, context, updater) {
      this.props = props;
      this.constext = {};
      this.refs = {};
      this.updater = null;
    }
    static isReactComponent = true;
    setState(partialState) {
      this.updater.enqueueSetState(this, partialState);
    }
  }

  var React = {
    createElement: createElement,
    Component: Component,
  };

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

  const HostRoot = 3;

  let workInProgress = {};
  function renderRootSync(root) {
    root.finishedWork = null;
    workInProgress = root.current;
    workInProgress.alternate = root.current;
    root.current.alternate = workInProgress;
  }
  function updateContainer(element, root) {
    // 生成更新对象
    const update = {
      payload: element,
      next: null,
    };
    // 入队更新
    update.next = update;
    const fiberNode = root.current;
    fiberNode.updateQueue.shared.interleaved = update;

    // 同步渲染
    renderRootSync(root);
    root.finishedWork = root.current.alternate;
  }
  function render(element, container) {
    console.log(111, element, container);
    // 生成root
    const rootFiber = new FiberNode(HostRoot);
    rootFiber.updateQueue = {
      shared: {
        pending: null,
        interleaved: null,
      },
    };
    const root = {
      containerInfo: container,
      current: rootFiber,
    };
    rootFiber.stateNode = root;
    container._reactContainer = root;

    // 更新
    updateContainer(element, root);
  }

  var ReactDOM = {
    render: render,
  };

  const element = /*#__PURE__*/ React.createElement('div', null, 'hello world');
  ReactDOM.render(element, document.getElementById('root'));
})();
//# sourceMappingURL=bundle.js.map
