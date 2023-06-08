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

ReactDOM.render(element, document.getElementById("root"));
