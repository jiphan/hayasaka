import { Client } from 'discord.js';
import { google } from 'googleapis';

/**
 * An object containing auth info for the bot session.
 * @prop    {Client}    dClient     Discord Client
 * @prop    {JWT}       gClient     Google JavaScript Web Token.
 */
export class authSession {
    constructor(client_email, private_key, bot_token, api_key) {
        this.client_email = client_email;
        this.private_key = private_key;
        this.bot_token = bot_token;
        this.yClient = api_key;

        this.dClient = new Client();
        this.gClient = new google.auth.JWT(
            client_email, 
            null, 
            private_key, 
            ['https://www.googleapis.com/auth/spreadsheets']
        );
    }

    /**
     * Attempts to authorize the session w/ Discord & Google
     */
    authorize() {
        this.gClient.authorize(function(err, tokens){ 
            if (err) {
                console.log(err);
                process.exit(1);
            }
            console.log('Connected!'); 
        });
        
        this.dClient.login(this.bot_token);
    }
}