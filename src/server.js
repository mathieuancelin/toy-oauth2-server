const fs = require('fs');
const _ = require('lodash');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const OAuthServer = require('express-oauth-server');
const { InMemoryDataStore } = require('./store');

const argv = require('minimist')(process.argv.slice(2));
const debug = argv.debug || process.env.DEBUG || false;
const port = argv.port || process.env.PORT || 8082;

const users = (() => {
  const usersPath = argv.users || process.env.USERS;
  if (usersPath && usersPath.startsWith('.') && usersPath.endsWith('.json')) {
    return require('../' + usersPath);
  } else if (usersPath && usersPath.startsWith('.') && usersPath.endsWith('.js')) {
    const mod = require('../' + usersPath);
    return mod.users();
  } else {
    return [];
  }
})();

const clients = (() => {
  const clientsPath = argv.clients || process.env.CLIENTS;
  if (clientsPath && clientsPath.startsWith('.') && clientsPath.endsWith('.json')) {
    return require('../' + clientsPath);
  } else if (clientsPath && clientsPath.startsWith('.') && clientsPath.endsWith('.js')) {
    const mod = require('../' + clientsPath);
    return mod.clients();
  } else {
    return [];
  }
})();

function debugLog(...params) {
  if (debug) {
    console.log(...params);
  }
}

const loginTemplate = _.template(fs.readFileSync('./src/login.html').toString('utf-8'));
const store = new InMemoryDataStore(clients, users);
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.oauth = new OAuthServer({ model: store });

function login(req, res) {
  debugLog('GET /oauth/authorize');
  const client = store.getClient(req.query.client_id);
  const title = client.title;
  const logo = client.logo;
  const state = req.query.state || '12345';
  const scope = req.query.scope;
  const client_id = req.query.client_id;
  const response_type = req.query.response_type;
  const redirect_uri = req.query.redirect_uri;
  const html = loginTemplate({
    title,
    state,
    scope,
    client_id,
    response_type,
    redirect_uri,
    logo,
  });
  res
    .status(200)
    .type('text/html')
    .send(html);
}

app.get('/oauth/authorize', login);

app.get('/oauth/login', login);

app.all('/oauth/logout', (req, res) => {
  const redirect = req.query.redirect_uri || req.body.redirect_uri;
  res
    .status(302)
    .set('Location', redirect)
    .send('');
});

app.post('/oauth/authorize', (req, res, next) => {
  debugLog('POST /oauth/authorize');
  return app.oauth.authorize({
    authenticateHandler: {
      handle: req => {
        return store.getUser(req.body.username, req.body.password);
      },
    },
  })(req, res, next);
});

app.post('/oauth/token', (req, res, next) => {
  debugLog('POST /oauth/token');
  return app.oauth.token()(req, res, next);
});

app.post('/userinfo', (req, res) => {
  const accessToken = req.body['access_token'];
  debugLog('POST /userinfo for access_token', accessToken);
  const userInfo = store.getUserInfo(accessToken);
  if (userInfo) {
    res.status(200).send(userInfo);
  } else {
    res.status(404).send({ error: 'not found' });
  }
});

app.listen(port, () => {
  debugLog(`OAuth server listening at http://0.0.0.0:${port}`);
});
