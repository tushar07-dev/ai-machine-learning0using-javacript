import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080/auth',
  realm: 'myrealm',
  clientId: 'myclient',
});

export const useKeycloakAuth = () => {
  const login = () => keycloak.login();
  const logout = () => keycloak.logout();
  const isAuthenticated = () => keycloak.authenticated;
  const getAccessToken = () => keycloak.token;

  return { login, logout, isAuthenticated, getAccessToken };
};

export default keycloak;