import { Client } from 'discord.js';
import { google } from 'googleapis';
var OAuth2 = google.auth.OAuth2;
var fs = require('fs');
var readline = require('readline');

var SCOPES = ['https://www.googleapis.com/auth/youtube'];
var TOKEN_DIR = __dirname;
var TOKEN_PATH = TOKEN_DIR + '/yt-token.json';

/**
 * An object containing auth info for the bot session.
 * @prop    {Client}    dClient     Discord Client
 * @prop    {JWT}       gClient     Google JavaScript Web Token.
 */
export class authSession {
    constructor(key) {
        this.client_email = key.client_email;
        this.private_key = key.private_key;
        this.bot_token = key.bot_token;

        this.client_id = key.client_id;
        this.client_secret = key.client_secret;
        this.redirect_url =  key.redirect_uris[0];

        this.dClient = new Client();
        this.gClient = new google.auth.JWT(
            this.client_email, 
            null, 
            this.private_key, 
            ['https://www.googleapis.com/auth/spreadsheets']
        );
        this.yClient = new OAuth2(
            this.client_id,
            this.client_secret,
            this.redirect_url
        );
    }

    /**
     * Attempts to authorize the session w/ Discord & Google
     */
    authorize() {
        this.dClient.login(this.bot_token);
        this.gClient.authorize(function(err, tokens){ 
            if (err) {
                console.log(err);
                process.exit(1);
            }
            console.log('Connected!'); 
        });
        yauthorize(this.yClient);
    }
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function yauthorize(oauth2Client) {
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function(err, token) {
      if (err) {
        getNewToken(oauth2Client);
      } else {
        oauth2Client.credentials = JSON.parse(token);
      }
    });
  }

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client) {
    var authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
      rl.close();
      oauth2Client.getToken(code, function(err, token) {
        if (err) {
          console.log('Error while trying to retrieve access token', err);
          return;
        }
        oauth2Client.credentials = token;
        storeToken(token);
      });
    });
  }

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
    try {
      fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
      if (err.code != 'EEXIST') {
        throw err;
      }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
      if (err) throw err;
      console.log('Token stored to ' + TOKEN_PATH);
    });
    console.log('Token stored to ' + TOKEN_PATH);
  }