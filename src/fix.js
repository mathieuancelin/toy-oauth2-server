// https://github.com/oauthjs/node-oauth2-server
// authorize-handler.js l 192: replace `if (redirectUri && !_.includes(client.redirectUris, redirectUri)) {` to `if (redirectUri && !_.includes(client.redirectUris, redirectUri.split('?')[0])) {`
const fs = require('fs');

const start = Date.now();
const filepath = './node_modules/oauth2-server/lib/handlers/authorize-handler.js';
const content = fs.readFileSync(filepath).toString('utf-8');
const newContent = content.replace(
  'if (redirectUri && !_.includes(client.redirectUris, redirectUri)) {',
  "if (redirectUri && !_.includes(client.redirectUris, redirectUri.split('?')[0])) {"
);
fs.writeFileSync(filepath, newContent);
console.log(`Applied patch on ${filepath} in ${Date.now() - start} ms.`);
