import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ReactKeycloakProvider keycloak={keycloak}>
        <App />
      </ReactKeycloakProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
