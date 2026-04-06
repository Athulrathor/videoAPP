import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { Provider } from "react-redux";
import { store,persistor as reduxPersister } from "./apps/store.js";

import { queryClient } from "./apps/queryClient.js";
import { PersistGate } from 'redux-persist/integration/react';
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { persister as queryPersister } from './apps/queryClient.js';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{persister: queryPersister}}
    >
      <PersistGate loading={null} persistor={reduxPersister}>
        <App />
      </PersistGate>
    </PersistQueryClientProvider>
  </Provider>
)
