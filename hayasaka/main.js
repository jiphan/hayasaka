import * as gs from './gsheet.js';
import * as yt from './youtube.js';
import * as fn from './functions.js';
import { authSession } from './auth.js';
import * as key from '../keys.json';
import * as conf from './conf.json';

const session = new authSession(key);
session.authorize();

session.dClient.on('ready', ()=> console.log('good morning!'));
let recents = [];

session.dClient.on('message', msg=> {
    if(!msg.content.startsWith(conf.bot_prefix)) return;
    let args = msg.content.substring(conf.bot_prefix.length).split(" ");

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
        case 'edit':
            // sanitize input, permissions
            if(args[1].search('!') == -1) {
                msg.reply('which sheet?');
                break;
            }
            gs.edit(session.gClient, conf.spreadsheet_id, args[1], args[2]);
            msg.reply(`setting ${args[1]} to ${args[2]}!`)
            break;
        case 'good':
            msg.channel.send(fn.good(args));
            break;
        case 'ping':
            msg.channel.send('pong!');
            break;
        case 'playlist':
            msg.reply(`https://www.youtube.com/playlist?list=${conf.playlist_id}`);
            // yt.get_playlist(session.yClient, conf.playlist_id).then(results=> {
            //     msg.channel.send(embed('[playlist]', results));
            // });
            break;
        case 'queue':
        case 'q':
            // sanitize input
            yt.add_video(session.yClient, conf.playlist_id, args[1], recents).then(items=> {
                msg.channel.send(embed('[recently added]', items));
            });
            break;
        case 'rng':
            if(isNaN(args[1])) msg.react('🤔');
            hype(msg, args[1])
            break;  
        case 'search': 
        case 's':
            yt.get_results(session.yClient, fn.parse(args)[0]).then(results=> {
                msg.channel.send(embed('[search results]', results));
            });
            break;
        case 'sheet':
            msg.reply(`https://docs.google.com/spreadsheets/d/${conf.spreadsheet_id}`);
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
    gs.lookup(session.gClient, conf.spreadsheet_id, conf.spreadsheet_dst).then((arr)=> {
        if(fn.query(arr, row)) {
            msg.channel.send('hey I know that song!');
        } else {
            gs.append(session.gClient, row, conf.spreadsheet_id, conf.spreadsheet_dst);
        }
    });
}

function embed(title, results) {
    let fields = [];
    results.forEach(r=> {
        fields.push({name: r[0], value: r[1]})
    })
    return {embed: {color: 0x0099ff, title: title, fields}}
}

function hype(msg, max) {
    msg.channel.send('I pick').then(m=> {
        m.edit(`${m.content} .`).then(m=> {
            setTimeout(() => {
                m.edit(`${m.content} .`).then(m=> {
                    setTimeout(() => {
                        m.edit(`${m.content} .`).then(
                            setTimeout(() => {
                                m.edit(`${m.content} ${fn.rng(max)}!`)
                            }, 1000)
                        )
                    }, 500);
                })
            }, 500);
        })
    })
}