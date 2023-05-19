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
  function createElement$1(type, config, ...children) {
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
    createElement: createElement$1,
  };

  const FunctionComponent = 0;
  const ClassComponent = 1;
  const HostRoot = 3;
  const HostComponent = 5;
  const HostText = 6;
  function getTag(element) {
    if (element.$$typeof === REACT_ELEMENT) {
      if (typeof element.type === 'string') {
        return HostComponent;
      }
      if (typeof element.type === 'function') {
        if (element.type.isReactComponent) {
          return ClassComponent;
        }
        return FunctionComponent;
      }
    }
    if (element.$$typeof === REACT_TEXT) {
      return HostText;
    }
  }

  class Fiber {
    constructor({ tag, props, type, key }) {
      this.tag = tag;
      this.pendingProps = props;
      this.type = type;
      this.key = key;
      this.child = null;
      this.sibling = null;
      this.return = null;
      this.stateNode = null;
      this.alternate = null;
    }
  }

  // 工作单元，--> 子fiber
  function beginWork(workInProgress) {
    switch (workInProgress.tag) {
      case HostRoot:
        return updateHostRoot(workInProgress);
      case HostComponent:
        return updateHostComponent(workInProgress);
      case FunctionComponent:
        return updateFunctionComponent(workInProgress);
      case ClassComponent:
        return updateClassComponent(workInProgress);
      case HostText:
      default:
        return null;
    }
  }
  function updateFunctionComponent(workInProgress) {
    const { type, pendingProps } = workInProgress;
    const nextChildren = type(pendingProps);
    workInProgress.child = reconcileChildren(workInProgress, nextChildren);
    return workInProgress.child;
  }
  function updateClassComponent(workInProgress) {
    const { type, pendingProps } = workInProgress;
    const instance = new type(pendingProps);
    const nextChildren = instance.render();
    workInProgress.child = reconcileChildren(workInProgress, nextChildren);
    return workInProgress.child;
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
  function reconcileChildren(workInProgress, nextChildren) {
    if (Array.isArray(nextChildren)) {
      return reconcileArrayChildren(workInProgress, nextChildren);
    } else {
      return reconcileSingElement(workInProgress, nextChildren);
    }
  }
  function reconcileSingElement(workInProgress, element) {
    const newFiber = new Fiber({
      tag: getTag(element),
      props: element.props,
      key: element.key,
      type: element.type,
    });
    newFiber.return = workInProgress;
    return newFiber;
  }
  function reconcileArrayChildren(workInProgress, nextChildren) {
    let firstFiber = null;
    let prevFiber = null;
    nextChildren.forEach((child) => {
      const newFiber = reconcileSingElement(workInProgress, child);
      if (!firstFiber) {
        firstFiber = newFiber;
      } else {
        prevFiber.sibling = newFiber;
      }
      prevFiber = newFiber;
    });
    return firstFiber;
  }

  function createTextNode(text) {
    return document.createTextNode(text);
  }
  function createElement(tag) {
    return document.createElement(tag);
  }
  function appendChild(parentNode, node) {
    parentNode.appendChild(node);
  }

  function completeWork(workInProgress) {
    switch (workInProgress.tag) {
      case HostText:
        const textNode = createTextNode(workInProgress.pendingProps);
        workInProgress.stateNode = textNode;
        break;
      case HostComponent:
        // 生产dom
        const dom = createElement(workInProgress.type);
        // 挂载子元素
        appendAllChildren(dom, workInProgress);
        // 属性
        initialDomProps(dom, workInProgress);
        // 关联
        workInProgress.stateNode = dom;
        break;
    }
  }
  function appendAllChildren(dom, workInProgress) {
    let childFiber = workInProgress.child;
    while (childFiber) {
      const node = childFiber.stateNode;
      appendChild(dom, node);
      childFiber = childFiber.sibling;
    }
  }
  function initialDomProps(dom, workInProgress) {
    const { children, ...domProps } = workInProgress.pendingProps;
    for (const [k, v] of Object.entries(domProps)) {
      if (k === 'style') {
        for (const [sk, sv] of Object.entries(v)) {
          dom.style[sk] = sv;
        }
        continue;
      }
      dom[k] = v;
    }
  }

  let workInProgress = null;
  function renderRootSync(root) {
    // 生成工作单元
    workInProgress = {
      ...root.current,
    };
    workInProgress.alternate = root.current;
    root.current.alternate = workInProgress;

    // 循环
    while (workInProgress) {
      performUnitOfWork(workInProgress);
    }
  }
  function performUnitOfWork(unitOfWork) {
    const next = beginWork(unitOfWork);
    if (!next) {
      completeUnitOfWork(unitOfWork);
    } else {
      workInProgress = next;
    }
  }
  function completeUnitOfWork(unitOfWork) {
    let completedWork = unitOfWork;
    while (completedWork) {
      // 完成当前节点
      completeWork(completedWork);
      // 是否有兄弟节点，begin
      if (completedWork.sibling) {
        workInProgress = completedWork.sibling;
        return;
      }
      // 完成父元素
      workInProgress = completedWork = completedWork.return;
    }
  }

  function commitRoot(root) {
    const finishedWork = root.finishedWork;
    const parentNode = root.containerInfo;
    let childFiber = finishedWork.child;
    let node = null;
    while (!node) {
      node = childFiber.stateNode;
      childFiber = childFiber.child;
    }
    appendChild(parentNode, node);
  }

  function render(element, container) {
    // 生成根对象
    const root = {
      containerInfo: container,
      finishedWork: null,
      current: null,
    };
    // 生产根fiber
    const hostRootFiber = new Fiber({
      tag: HostRoot,
      props: element,
    });
    root.current = hostRootFiber;
    hostRootFiber.stateNode = root;

    // 生成dom
    renderRootSync(root);
    root.finishedWork = root.current.alternate;

    // 挂载
    commitRoot(root);
  }

  var ReactDOM = {
    render,
  };

  const element = /*#__PURE__*/ React.createElement(
    'div',
    null,
    /*#__PURE__*/ React.createElement(
      'h1',
      {
        className: 'test',
        title: 'h',
      },
      'hello',
    ),
    /*#__PURE__*/ React.createElement(
      'h2',
      {
        style: {
          color: 'red',
        },
      },
      'world',
    ),
  );
  class ClassCom {
    static isReactComponent = true;
    render() {
      return /*#__PURE__*/ React.createElement(
        'div',
        null,
        /*#__PURE__*/ React.createElement('h1', null, '111111\u7EC4\u4EF6'),
        element,
      );
    }
  }
  ReactDOM.render(/*#__PURE__*/ React.createElement(ClassCom, null), document.getElementById('root'));
})();
//# sourceMappingURL=bundle.js.map
