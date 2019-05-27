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
            add.gsmatch(session.gClient, spreadsheet_id, spreadsheet_dst).then(function(arr) {
                if(add.query(arr, row)) {
                    msg.channel.send('hey I know that song!');
                    // maybe update interest count
                } else {
                    add.gsappend(session.gClient, row, spreadsheet_id, spreadsheet_dst);
                }
            });
            break;
        case 'thanks':
            msg.reply('happy to help!');
            break;
        case 'help':
            msg.reply('you can !ping, !sheet, !add, and !thanks. More info on how to use !add coming soon ~');
            break;
    }
})
