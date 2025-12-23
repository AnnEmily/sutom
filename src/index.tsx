import React from 'react';
import * as ReactDOMClient from "react-dom/client";
// import { Container } from "semantic-ui-react";

import Solver from "./Solver";

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

// root.render(
//   <Container>
//     <Solver />
//   </Container>
// );

root.render(
  <Solver />
);
