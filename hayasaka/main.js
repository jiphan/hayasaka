import * as gs from './gsheet.js';
import * as yt from './youtube.js';
import * as fn from './functions.js';
import { authSession } from './auth.js';
import { client_email, private_key, bot_token, api_key } from '../keys.json';
import { bot_prefix, spreadsheet_id, spreadsheet_dst } from './conf.json';

const session = new authSession(client_email, private_key, bot_token, api_key);
session.authorize();

session.dClient.on('ready', ()=> { 
    console.log('good morning!');
})

session.dClient.on('message', msg=> {
    if(!msg.content.startsWith(bot_prefix)) return;
    let args = msg.content.substring(bot_prefix.length).split(" ");

    switch(args[0]) {
        case 'add':
        case 'a':
            let row = fn.parse(args);
            let div = row.splice(1, 1);
            if(!row[0] && row[2]) {
                yt.get_title(row[2]).then((title)=> {
                    row[0] = title;
                    append(msg, row, div);
                });
            } else {
                append(msg, row, div);
            }
            break;
        case 'good':
            msg.channel.send(fn.good(args));
            break;
        case 'ping':
            msg.channel.send('pong!');
            break;
        case 'rng':
            msg.reply(`I pick... ${fn.rng(args[1])}!`);
            if(isNaN(args[1])) msg.react('🤔');
            break;  
        case 'search': 
        case 's':
            yt.get_results(session.yClient, fn.parse(args)[0]).then(results=> {
                msg.channel.send(embed(results));
            });
            break;
        case 'sheet':
            msg.reply(`https://docs.google.com/spreadsheets/d/${spreadsheet_id}`);
            break;
        case 'thanks':
            msg.reply('happy to help!');
            msg.react('✌');
            break;
        case 'help':
            msg.reply('you can !add <text>, !ping, !rng <number>, !sheet, and !thanks ~');
            break;
        default:
            msg.channel.send('wait that\'s illegal');
    }
})

function append(msg, row, div) {
    msg.reply(`**${row[0]}** ${div} ${row[1]}`.trim() + '... got it!');
    gs.lookup(session.gClient, spreadsheet_id, spreadsheet_dst).then((arr)=> {
        if(fn.query(arr, row)) {
            msg.channel.send('hey I know that song!');
        } else {
            gs.append(session.gClient, row, spreadsheet_id, spreadsheet_dst);
        }
    });
}

function embed(results) {
    let fields = [];
    results.forEach(r=> {
        fields.push({name: r[0], value: r[1]})
    })
    return {embed: {color: 0x0099ff, fields}}
}