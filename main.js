const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'NTgyMDAwMzI2NzY5Mzc3Mjg1.XOn47A.ueC4ZZQchb7SBX9gdd_GP8a1i7Q';
const PREFIX = '!';

const {google} = require('googleapis');
const keys = require('./keys.json');
const client = new google.auth.JWT(
    keys.client_email, 
    null, 
    keys.private_key, 
    ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize(function(err, tokens){
    if(err){
        console.log(err);
        return;
    } else{
        console.log('Connected!');
    }
});

async function gsrun(cl, song){
    const gsapi = google.sheets({version:'v4', auth: cl })
    const update = {
        spreadsheetId: '11OLzmcRk5G8H49RQi1gCkuPyZavndyDBAQSwne4Zz5Y',
        range: 'Data!A1',
        valueInputOption: 'USER_ENTERED',
        resource: { values: [ [song], '<-- bot post' ], }
    };
    let res = await gsapi.spreadsheets.values.append(update);
    console.log('OK!');
}

bot.login(token);
bot.on('ready', () =>{
    console.log('good morning!');
})

bot.on('message', msg=>{
    let args = msg.content.substring(PREFIX.length).split(" ");
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
            gsrun(client, song);
            break;
            // add_clean --> song.split('|') --> multiple cells?
        case 'help':
            msg.reply('you can !ping, !sheet, and !add ~')
            break;
    }
})