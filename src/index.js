import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import 'bulma/css/bulma.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='125004556887-l37ga2f4ok8jqbbguneu0kooajoki9dq.apps.googleusercontent.com'>
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  </GoogleOAuthProvider>
)
