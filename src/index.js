import React from "./react";
import ReactDOM from "./reactDom";

const element = (
  <div onClick={() => console.log(334444, "div")}>
    <h1 className="test" title={"h"} onClick={() => console.log(334444, "h1")}>
      hello
    </h1>
    <h2 style={{ color: "red" }}>world</h2>
  </div>
);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      a: 1,
    };
  }
  render() {
    return (
      <div
        onClick={() => {
          this.setState({
            a: 2,
          });
        }}
      >
        hello-world-a-{this.state.a}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
