import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import "./index.css";
import Store from "./Components/Redux/Store.js";
import { Provider } from "react-redux";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={Store}>
    <App />
  </Provider>

  // </React.StrictMode>,
);
