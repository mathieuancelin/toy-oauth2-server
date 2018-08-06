# Toy Oauth2 Server

This project is a toy implementation of an OAuth2 server with an in memory datastore.

You have to start it with files containing a list of clients and users to make it work properly.

## users.json

```json
[
  {
    "id": "1",
    "user_id": "1",
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
    "grants": ["authorization_code", "client_credentials", "password"],
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

go on `http://127.0.0.1:8082/login?state=${random_state}&scope=openid%20profile%20email%20name&client_id=1234&response_type=code&redirect_uri=http://privateapps.foo.bar:8080/privateapps/generic/callback?desc=${service_id}`, log in using `mathieu/password`

## Endpoints 

* `GET`  /login?state&scope&client_id&response_type&redirect_uri
* `GET`  /logout?redirect_uri
* `POST` /oauth/authorize => body: state&scope&client_id&response_type&redirect_uri
* `POST` /oauth/token => body: code&grant_type&client_id&client_secret&redirect_uri
* `POST`  /userinfo => body: access_token

# Authorization code grant

```sh
curl -X GET http://127.0.0.1:8082/login?state=xxx&scope=openid%20profile%20email%20name&client_id=xxx&response_type=code&redirect_uri=xxx
curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' http://127.0.0.1:8082/oauth/authorize -d 'state=xxx&scope=openid%20profile%20email%20name&client_id=1234&response_type=code&redirect_uri=xxx&username=xxx&password=xxx'
curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' http://127.0.0.1:8082/oauth/token -d 'code=xxx&grant_type=authorization_code=xxx&client_id=xxx&client_secret=xxx&redirect_uri=xxx'
curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' http://127.0.0.1:8082/userinfo -d 'access_token=xxx'
```

# Client credential grant

```sh
curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' http://127.0.0.1:8082/oauth/token -u xxx:xxx -d 'grant_type=client_credentials'
curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' http://127.0.0.1:8082/userinfo -d 'access_token=xxxxx'
```

# Password grand

```sh
curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' http://127.0.0.1:8082/oauth/token -u xxx:xxx -d 'grant_type=password&username=xxx&password=xxx'
curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' http://127.0.0.1:8082/userinfo -d 'access_token=xxx'
```

