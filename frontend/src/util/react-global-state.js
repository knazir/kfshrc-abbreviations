import React from "react";

class State {
  constructor() {
    this.state = {};
    this.subscriptions = [];
  }

  subscribe(cb) {
    this.subscriptions.push(cb);
    return this.subscriptions.lastIndexOf(cb);
  }

  unsubscribe(handle) {
    delete this.subscriptions[handle];
  }

  setState(obj) {
    this.state =  Object.assign({}, this.state, obj);
    this.subscriptions.forEach((cb) => {
      if(cb) {
        cb();
      }
    })
  }
}

const globState = new State();

const gs = (Component) => {
  return class GlobalState extends Component {
    static get Component() {
      return Component;
    }

    state = { state: {} };

    componentDidMount() {
      this.subsHandle = globState.subscribe(this.handleChange.bind(this));
    }

    componentWillUnmount() {
      globState.unsubscribe(this.subsHandle);
    }

    handleChange() {
      this.setState({ state: globState.state });
    }

    render() {
      return <Component {...this.props} state={this.state.state} setState={globState.setState.bind(globState)} />
    }
  };
};

export { gs };
