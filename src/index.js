import React from "./react";
import ReactDOM from "./reactDom";

const element = (
  <div>
    <h1 className="test" title={"h"}>
      hello
    </h1>
    <h2 style={{ color: "red" }}>world</h2>
  </div>
);

function Fun() {
  return (
    <div>
      <h1>函数式组件</h1>
      {element}
    </div>
  );
}

class ClassCom {
  static isReactComponent = true;
  render() {
    return (
      <div>
        <h1>111111组件</h1>
        {element}
      </div>
    );
  }
}

ReactDOM.render(<ClassCom />, document.getElementById("root"));
