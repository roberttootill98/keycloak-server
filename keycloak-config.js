// keycloak config

// modules
const Keycloak = require('keycloak-connect');
require('dotenv').config();

module.exports.initKeycloak = (memoryStore) => {

  return new Keycloak({
    store: memoryStore
  }, {
    realm: process.env.KEYCLOAK_REALM,
    'auth-server-url': `${process.env.HOST}:${process.env.PORT_KEYCLOAK}`,
    'ssl-required': 'external',
    resource: process.env.KEYCLOAK_CLIENT,
    'public-client': true,
    'confidential-port': 0
  });
}