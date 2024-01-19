// main server file

// modules
const express = require('express');
const express_session = require('express-session');
const cors = require('cors');
require('dotenv').config();

// auth
const keycloak_config = require('./keycloak-config.js');

//#region server setup

const app = express();

//#region cors

const origins = [];

for(const port of [
  process.env.PORT_SERVER,
  process.env.PORT_CLIENT,
  process.env.PORT_KEYCLOAK
]) {
  origins.push(`${process.env.HOST}:${port}`);
}

app.use(cors({
  origin: origins
}));

//#endregion cors

//#region session

const session_memoryStore = new express_session.MemoryStore();

app.use(express_session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: session_memoryStore
}));

//#endregion session

//#region keycloak

const keycloak = keycloak_config.initKeycloak(session_memoryStore);

// custom middleware
function keycloak_authorize(req, res, next) {
  console.log('authorizing...');
  console.log('bearer token: ', req.headers.authorization);

  
} 

app.use(keycloak.middleware());

//#endregion keycloak

//#endregion server setup

//#region routes

// public endpoint, no protection
app.get('/test', (req, res) => {
  res.send('test!');
});

// protected endpoint
// app.get('/protected', keycloak_authorize, (req, res) => {
app.get('/protected', keycloak.protect(), (req, res) => {
  console.log('someone access protected route!');
  res.send('secret text!');
});

//#endregion routes

// start server
app.listen(process.env.PORT_SERVER, () => {
  console.log(`server running on port: ${process.env.PORT_SERVER}`);
});