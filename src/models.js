class Token {
  constructor(accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt, user) {
    accessToken = accessToken;
    accessTokenExpiresAt = accessTokenExpiresAt;
    refreshToken = refreshToken;
    refreshTokenExpiresAt = refreshTokenExpiresAt;
    user = user;
  }
}

class AuthorizationCode {
  constructor(authorizationCode, scope, expiresAt, redirectUri, client, user) {
    this.authorizationCode = authorizationCode;
    this.scope = scope;
    this.expiresAt = expiresAt;
    this.redirectUri = redirectUri;
    this.client = client;
    this.user = user;
  }
}

class Client {
  constructor(id, title, logo, clientSecret, grants, redirectUris) {
    this.id = id;
    this.title = title;
    this.logo = logo;
    this.clientId = id;
    this.clientSecret = clientSecret;
    this.grants = grants;
    this.redirectUris = redirectUris;
  }
}

class User {
  constructor(id, username, password, name, email) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.name = name;
    this.email = email;
  }
}

exports.Token = Token;
exports.AuthorizationCode = AuthorizationCode;
exports.Client = Client;
exports.User = User;
