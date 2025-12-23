import React from 'react';
import ReactDOM from "react-dom";
import Solver from "./Solver";

// const styleLink = document.createElement("link");
// styleLink.rel = "stylesheet";
// styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
// document.head.appendChild(styleLink);

ReactDOM.render(
  <React.StrictMode>
    <Solver />
  </React.StrictMode>,
  document.getElementById("root")
);