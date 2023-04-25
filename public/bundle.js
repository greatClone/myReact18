(function () {
  'use strict';

  const REACT_ELEMENT = Symbol('react_element');
  const REACT_TEXT = Symbol('react_text');

  function toObject(element) {
    if (typeof element === 'string' || typeof element === 'number') {
      return {
        props: element,
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

  var React = {
    createElement: createElement,
  };

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

  const HostRoot = 3;
  const HostComponent = 5;
  const HostText = 6;

  function beginWork(workInProgress) {
    switch (workInProgress.tag) {
      case HostRoot:
        return updateHostRoot(workInProgress);
      case HostComponent:
        return updateHostComponent(workInProgress);
      case HostText:
        return updateHostText();
      default:
        return null;
    }
  }
  function updateHostRoot(workInProgress) {
    const nextChildren = workInProgress.pendingProps;
    workInProgress.child = reconcileChildren(workInProgress, nextChildren);
    return workInProgress.child;
  }
  function updateHostComponent(workInProgress) {
    const nextChildren = workInProgress.pendingProps.children;
    workInProgress.child = reconcileChildren(workInProgress, nextChildren);
    return workInProgress.child;
  }
  function updateHostText(workInProgress) {
    return null;
  }
  function reconcileChildren(workInProgress, nextChildren) {
    if (nextChildren.$$typeof === REACT_ELEMENT) {
      return reconcileSingleElement(workInProgress, nextChildren);
    }
    if (Array.isArray(nextChildren)) {
      return reconcileChildrenArray(workInProgress, nextChildren);
    }
  }
  function reconcileSingleElement(workInProgress, element) {
    const created = new FiberNode({
      tag: getTag(element),
      props: element.props,
      key: element.key,
      type: element.type,
    });
    created.return = workInProgress;
    return created;
  }
  function reconcileChildrenArray(workInProgress, nextChildren) {
    let firstChildren = null;
    let prevFiber = null;
    nextChildren.forEach((child) => {
      const newFiber = reconcileSingleElement(workInProgress, child);
      if (!prevFiber) {
        firstChildren = newFiber;
      } else {
        prevFiber.sibling = newFiber;
      }
      prevFiber = newFiber;
    });
    return firstChildren;
  }
  function getTag(element) {
    if (element.$$typeof === REACT_ELEMENT && typeof element.type === 'string') {
      return HostComponent;
    }
    if (element.$$typeof === REACT_TEXT) {
      return HostText;
    }
  }

  let workInProgress = null;
  function renderRootSync(root) {
    // 生成 workInProgress
    workInProgress = {
      ...root.current,
    };
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

  function render(element, container) {
    console.log(999, element);
    // 生成一个全局的对象、根fiber
    const root = {
      containerInfo: container,
      finishedWork: null,
    };
    const hostRootFiber = new FiberNode({
      tag: HostRoot,
      props: element,
    });
    root.current = hostRootFiber;
    hostRootFiber.stateNode = root;

    // 生成 dom 树
    renderRootSync(root);
  }

  var ReactDOM = {
    render,
  };

  const element = /*#__PURE__*/ React.createElement(
    'div',
    null,
    /*#__PURE__*/ React.createElement('h1', null, 'hello'),
    /*#__PURE__*/ React.createElement('h2', null, 'world'),
  );
  console.log(333444, element);
  ReactDOM.render(element, document.getElementById('root'));
})();
//# sourceMappingURL=bundle.js.map
