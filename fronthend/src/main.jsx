import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store.js";

// persistor.purge();

const root = createRoot(document.getElementById("root"));
root.render(
  <>
    <StrictMode>
      <Provider store={store}>
        <PersistGate
          loading={<h1>Loading...</h1>}
          persistor={persistor}
          onBeforeLift={() => {
            console.log("Rehydration complete!");
          }}
        >
          <App />
        </PersistGate>
      </Provider>
    </StrictMode>
  </>
);
