const Discord = require('discord.js');
const {google} = require('googleapis');
const keys = require('./keys.json');
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

async function gsappend(client, song){
    const gsapi = google.sheets({version:'v4', auth: client })
    const update = {
        spreadsheetId: keys.spreadsheet_id,
        range: keys.spreadsheet_dst,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [ [song,'<-- bot post' ] ], }
    };
    let res = await gsapi.spreadsheets.values.append(update);
    console.log(res.config);
}

bot.login(keys.bot_token);
bot.on('ready', () =>{ console.log('good morning!');})

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
            var song = args.slice(1).join(' ');
            msg.reply('\"' + song + '\"...  got it!')
            gsappend(client, song)
            break;
            // add_clean --> song.split('|') --> multiple cells?
        case 'help':
            msg.reply('you can !ping, !sheet, and !add ~')
            break;
    }
})