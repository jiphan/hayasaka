const Discord = require('discord.js');
const {google} = require('googleapis');
const keys = require('./keys');
const lib = require('./lib');
const bot = new Discord.Client();
const client = new google.auth.JWT(
    keys.client_email, 
    null, 
    keys.private_key, 
    ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize(function(err, tokens){ 
    console.log(err ? err : 'Connected!'); 
});

async function gsappend(client, row){
    const gsapi = google.sheets({version:'v4', auth: client })
    const update = {
        spreadsheetId: keys.spreadsheet_id,
        range: keys.spreadsheet_dst,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [ row ], }
    };
    let res = await gsapi.spreadsheets.values.append(update);
    // console.log(res.statusText);
}

bot.login(keys.bot_token);
bot.on('ready', () =>{ 
    console.log('good morning!');
})

bot.on('message', msg=>{
    if(!msg.content.startsWith(keys.bot_prefix)) return;
    let args = msg.content.substring(keys.bot_prefix.length).split(" ");

    switch(args[0]){
        case 'ping':
            msg.channel.send('pong!')
            break;
        case 'sheet':
            msg.reply('https://docs.google.com/spreadsheets/d/1V1TXuBip74BkEXaP20XDW7-uxa7B8xrRZpyhLMRlH8A')
            break;
        case 'add':
            let row = msg_parse(args);
            msg.reply(`**${row[0]}** ${row[2]} ${row[1]}... got it!`);
            row.pop()
            gsappend(client, row)
            break;
        case 'help':
            msg.reply('you can !ping, !sheet, and !add. More info on how to use !add coming soon ~')
            break;
    }
})

function msg_parse(args) {
    let i = what_div(args);
    if(i === -1) return [args.slice(1).join(' '), '', ''];
    let title = args.slice(1, i).join(' ');
    let source = args.slice(i + 1).join(' ');
    return [title, source, args[i]];    // [stand by me, sarazanmai, from]
}

function what_div(args) {
    let div = ['from', 'by', '|'];
    let divi = ''
    args.forEach(a =>{
        div.forEach(d =>{
            if(a === d) divi = a;
        })
    });
    return args.lastIndexOf(divi);
}