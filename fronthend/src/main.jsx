import React, { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store.js";

const VidTubeLoading = lazy(() => import('./components/LoadingScreen/VidTubeLoading.jsx'))

const root = createRoot(document.getElementById("root"));
root.render(
  <>
    <StrictMode>
      <Provider store={store}>
        <PersistGate
          loading={
            <div>
              <VidTubeLoading />
            </div>
          }
          persistor={persistor}
        >
          <App />
        </PersistGate>
      </Provider>
    </StrictMode>
  </>
);
