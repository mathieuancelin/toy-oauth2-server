const argv = require('minimist')(process.argv.slice(2));
const debug = argv.debug || process.env.DEBUG || false;

function debugLog(...params) {
  if (debug) {
    console.log(...params);
  }
}

class InMemoryDataStore {
  constructor(clients, users) {
    this.clients = clients || [];
    this.tokens = [];
    this.authorizationCode = [];
    this.users = users || [];
  }

  getAuthorizationCode(authorizationCode) {
    debugLog('getAuthorizationCode', authorizationCode);
    const codes = this.authorizationCode.filter(code => {
      return code.authorizationCode === authorizationCode;
    });
    return codes.length ? codes[0] : false;
  }

  revokeAuthorizationCode(authorizationCode) {
    debugLog('revokeAuthorizationCode', authorizationCode);
    this.authorizationCode = this.authorizationCode.filter(
      a => a.authorizationCode !== authorizationCode
    );
    return true;
  }

  revokeToken(token) {
    debugLog('revokeToken', token);
    this.tokens = this.tokens.filter(t => t.accessToken !== token);
  }

  saveAuthorizationCode(authorizationCode, client, user) {
    debugLog('saveAuthorizationCode', authorizationCode, client, user);
    authorizationCode.client = client;
    authorizationCode.user = user;
    this.authorizationCode.push(authorizationCode);
    return authorizationCode;
  }

  validateScope(scope) {
    debugLog('validateScope', scope);
    return true; // TODO: fix it
  }

  dump() {
    console.log('clients', this.clients);
    console.log('tokens', this.tokens);
    console.log('users', this.users);
  }

  getAccessToken(bearerToken) {
    debugLog('getAccessToken', bearerToken);
    const tokens = this.tokens.filter(token => {
      return token.accessToken === bearerToken;
    });
    return tokens.length ? tokens[0] : false;
  }

  getRefreshToken(bearerToken) {
    debugLog('getRefreshToken', bearerToken);
    const tokens = this.tokens.filter(token => {
      return token.refreshToken === bearerToken;
    });
    return tokens.length ? tokens[0] : false;
  }

  getClient(clientId, clientSecret) {
    debugLog('getClient', clientId, clientSecret);
    if (!clientSecret) {
      const clients = this.clients.filter(client => {
        return client.id === clientId;
      });
      return clients.length ? clients[0] : false;
    } else {
      const clients = this.clients.filter(client => {
        return client.id === clientId && client.clientSecret === clientSecret;
      });
      return clients.length ? clients[0] : false;
    }
  }

  saveToken(token, client, user) {
    debugLog('saveToken', token, client, user);
    const finalToken = {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      clientId: client.id,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      userId: user.id,
      user: user,
      client: client,
    };
    this.tokens.push(finalToken);
    return finalToken;
  }

  getUser(username, password) {
    debugLog('getUser', username, password);
    const users = this.users.filter(user => {
      return user.username === username && user.password === password;
    });
    return users.length ? users[0] : false;
  }

  getUserInfo(accessToken) {
    debugLog('getUserInfo', accessToken);
    const token = this.tokens.filter(t => t.accessToken === accessToken)[0];
    if (token) {
      return this.users.filter(u => u.id === token.userId)[0];
    }
    return null;
  }
}

exports.InMemoryDataStore = InMemoryDataStore;
