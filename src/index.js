import ReactDOM from "react-dom/client";
import App from "./App";

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// Render the main component into the root
root.render(<App />);

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );