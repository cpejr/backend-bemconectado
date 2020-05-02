
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const stream = require('stream');
const path = require("path");

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

const TOKEN_PATH = 'token.json';

const CREDENTIALS = {
  client_id: process.env.OAUTH2_CLIENT_ID,
  project_id: process.env.OAUTH2_PROJECT_ID,
  auth_uri: process.env.OAUTH2_AUTH_URI,
  token_uri: process.env.OAUTH2_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.OAUTH2_AUTH_PROVIDER,
  client_secret: process.env.OAUTH2_CLIENT_SECRET,
  redirect_uris: process.env.OAUTH2_REDIRECT_URIS.split(','),
  javascript_origins: process.env.OAUTH2_JAVASCRIPT_ORIGINS.split(','),
}

console.log(CREDENTIALS)

let oAuth2Client;

/**
 * Create an OAuth2 client with the credentials, and then execute the
 * given callback function.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(callback) {
  const { client_secret, client_id, redirect_uris } = CREDENTIALS;

  oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    const jsonToken = JSON.parse(token);
    const jsonToken = { ...jsonToken, refresh_token: process.env.OAUTH2_REFRESH_TOKEN };

    oAuth2Client.setCredentials(jsonToken);
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
}


function validateCredentials(code, scope) {
  return new Promise((resolve, reject) => {
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        console.error(`Error retrieving access token(${token})`, err);
        return reject(err);
      }
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        console.log('Token stored to', TOKEN_PATH);
      });
      resolve(TOKEN_PATH);
      callback(oAuth2Client);
    });
  })
  
}
exports.validateCredentials = validateCredentials;

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
  const drive = google.drive({ version: 'v3', auth });
  drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  });
}

module.exports.config = function config() {
  // Load client secrets from a local file.
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(listFiles);
}

exports.uploadFile = function uploadFile(buffer, name, mimeType) {
  return new Promise(async (resolve, reject) => {
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(_uploadFile);

    function _uploadFile(auth) {

      let bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);


      const drive = google.drive({ version: 'v3', auth });
      var fileMetadata = { name: `${Date.now()}${path.extname(name)}`, parents: ["1razNdx4zhm39LWWZ_xyfzLViMSkQVju-"] };

      var media = {
        mimeType,
        body: bufferStream
      };

      drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
      }, function (err, res) {
        if (err) {
          // Handle error
          console.log(err);
          reject(err);
        } else {
          resolve(res.data.id)
        }
      });
    }
  })


}