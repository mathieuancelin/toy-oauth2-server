# Toy Oauth2 Server

This project is a toy implementation of an OAuth2 server with an in memory datastore.

You have to start it with files containing a list of clients and users to make it work properly.

## users.json

```json
[
  {
    "id": "1",
    "username": "mathieu",
    "password": "password",
    "name": "Mathieu",
    "email": "mathieu@foo.bar",
    "app_metadata": {
      "otoroshi_data": {
        "foo": "bar"
      }
    }
  }
]
```

## clients.json

```json
[
  {
    "id": "1234",
    "clientId": "1234",
    "clientSecret": "567890",
    "title": "Otoroshi",
    "logo": "https://github.com/MAIF/otoroshi/raw/master/resources/otoroshi-logo.png",
    "grants": ["authorization_code"],
    "redirectUris": ["http://privateapps.foo.bar:8080/privateapps/generic/callback"]
  }
]
```

## Start

```sh
git clone https://github.com/mathieuancelin/toy-oauth2-server.git
cd toy-oauth2-server
yarn install
yarn start --- --port=8082 --users=./users.json --clients=./clients.json
```

## Use it

go on `http://127.0.0.1:8082/oauth/login?state=${random_state}&scope=openid%20profile%20email%20name&client_id=1234&response_type=code&redirect_uri=http://privateapps.foo.bar:8080/privateapps/generic/callback?desc=${service_id}`, log in using `mathieu/password`

## Endpoints 

* `GET`  /login?state&scope&client_id&response_type&redirect_uri
* `GET`  /logout?redirect_uri
* `POST` /oauth/authorize => body: state&scope&client_id&response_type&redirect_uri
* `POST` /oauth/token => body: code&grant_type&client_id&client_secret&redirect_uri
* `GET`  /userinfo => body: access_token