import * as add from './add.js';
import { authSession } from './auth.js';
import { client_email, private_key, bot_token } from '../keys.json';
import { bot_prefix, spreadsheet_id, spreadsheet_dst } from './conf.json';

const session = new authSession(client_email, private_key, bot_token);
session.authorize();

session.dClient.on('ready', () =>{ 
    console.log('good morning!');
})

session.dClient.on('message', msg=>{
    if(!msg.content.startsWith(bot_prefix)) return;
    let args = msg.content.substring(bot_prefix.length).split(" ");

    switch(args[0]){
        case 'ping':
            msg.channel.send('pong!');
            break;
        case 'sheet':
            msg.reply(`https://docs.google.com/spreadsheets/d/${spreadsheet_id}`);
            break;
        case 'add':
            let row = add.msg_parse(args);
            let div = row.splice(1, 1);
            msg.reply(`**${row[0]}** ${div} ${row[1]}`.trim() + '... got it!');
            add.gsappend(session.gClient, row, spreadsheet_id, spreadsheet_dst);
            gsmatch(session.gClient, row, msg);
            break;
        case 'thanks':
            msg.reply('happy to help!');
            break;
        case 'help':
            msg.reply('you can !ping, !sheet, !add, and !thanks. More info on how to use !add coming soon ~');
            break;
    }
})

// kill me please
import { google } from 'googleapis';
function gsmatch(gClient, row, msg) {
    const gsapi = google.sheets({version:'v4', auth: gClient })
    gsapi.spreadsheets.values.get({
        spreadsheetId: spreadsheet_id,
        range: spreadsheet_dst,
        majorDimension: 'ROWS'
    }, function(err, response) {
        let match = false
        console.log(response.data.values);
        response.data.values.forEach(a =>{
            if(a[0] === row[0]) {
                if(a[1] === row[1]) match = true;
            }
        });
        if(match) msg.channel.send('hey I know that song!');
    });
}