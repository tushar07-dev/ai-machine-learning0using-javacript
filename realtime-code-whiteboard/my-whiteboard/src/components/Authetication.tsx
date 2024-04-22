import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Button } from 'react-bootstrap';

const Authentication: React.FC = () => {
  const { keycloak } = useKeycloak();

  const handleLogin = () => {
    keycloak?.login();
  };

  const handleLogout = () => {
    keycloak?.logout();
  };

  return (
    <div>
      {keycloak?.authenticated ? (
        <div>
          <p>Welcome, {keycloak?.idTokenParsed?.preferred_username}</p>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      ) : (
        <div>
          <p>Please log in to use the whiteboard.</p>
          <Button onClick={handleLogin}>Login</Button>
        </div>
      )}
    </div>
  );
};

export default Authentication;
