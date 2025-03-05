import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import LaunchList from "./LaunchList";

const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <LaunchList />
  </Provider>
);
