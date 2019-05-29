import * as add from './add.js';
import * as yt from './youtube.js';
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
        case 'add':
            let row = add.msg_parse(args);
            let div = row.splice(1, 1);
            if(!row[0] && row[2]) {
                yt.get_title(row[2]).then(function(title) {
                    row[0] = title;
                    append(msg, row, div);
                });
            } else {
                append(msg, row, div);
            }
            break;
        case 'ping':
                msg.channel.send('pong!');
                break;
        case 'sheet':
            msg.reply(`https://docs.google.com/spreadsheets/d/${spreadsheet_id}`);
            break;
        case 'test':
            break;
        case 'thanks':
            msg.react('✌');
            msg.reply('happy to help!');
            break;
        case 'help':
            msg.reply('you can !add, !ping, !sheet, and !thanks. More info on how to use !add coming soon ~');
            break;
    }
})

function append(msg, row, div) {
    msg.reply(`**${row[0]}** ${div} ${row[1]}`.trim() + '... got it!');
    add.gslookup(session.gClient, spreadsheet_id, spreadsheet_dst).then(function(arr) {
        if(add.query(arr, row)) {
            msg.channel.send('hey I know that song!');
        } else {
            add.gsappend(session.gClient, row, spreadsheet_id, spreadsheet_dst);
        }
    });
}