import React,{StrictMode} from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store.js";
import VidTubeLoading from './components/LoadingScreen/VidTubeLoading.jsx';
import { GoogleAuthWrapper } from "./components/GoogleAuthProvider.jsx";
// import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <GoogleAuthWrapper>
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
    </GoogleAuthWrapper>
  </StrictMode>
);
