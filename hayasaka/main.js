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
            msg.reply('https://docs.google.com/spreadsheets/d/1V1TXuBip74BkEXaP20XDW7-uxa7B8xrRZpyhLMRlH8A');
            break;
        case 'add':
            let row = add.msg_parse(args);
            msg.reply(`**${row[0]}** ${row[2]} ${row[1]}... got it!`);
            add.gsappend(session.gClient, row, spreadsheet_id, spreadsheet_dst);
            break;
        case 'help':
            msg.reply('you can !ping, !sheet, and !add. More info on how to use !add coming soon ~');
            break;
    }
})
