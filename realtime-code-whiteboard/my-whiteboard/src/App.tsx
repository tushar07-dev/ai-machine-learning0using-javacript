import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { KeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Whiteboard from '../components/Whiteboard';

const App: React.FC = () => {
  return (
    <KeycloakProvider keycloak={keycloak}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/whiteboard" element={<Whiteboard />} />
        </Routes>
      </Router>
    </KeycloakProvider>
  );
};

export default App;
