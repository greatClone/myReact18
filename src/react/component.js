class Component {
  static isReactComponent = {};
  constructor(props, context, updater) {
    this.props = props;
    this.context = context;
    this.updater = updater;
    this.refs = {};
  }

  setState(partialState) {
    this.updater.enqueueSetState(this, partialState);
  }
}

export default Component;
