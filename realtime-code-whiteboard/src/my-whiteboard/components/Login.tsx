import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Button } from 'react-bootstrap';

const LoginPage: React.FC = () => {
  const { keycloak } = useKeycloak();

  const handleLogin = () => {
    keycloak?.login();
  };

  return (
    <div>
      <h2>Login</h2>
      <Button onClick={handleLogin}>Login with Keycloak</Button>
    </div>
  );
};

export default LoginPage;
