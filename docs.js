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
        gsrun(client);
    }
});

async function gsrun(cl){
    const gsapi = google.sheets({version:'v4', auth: cl })
    const opt = {
        spreadsheetId: '11OLzmcRk5G8H49RQi1gCkuPyZavndyDBAQSwne4Zz5Y',
        range: 'Data!A2:B5'
    };
    let data = await gsapi.spreadsheets.values.get(opt);
    let dataArray = data.data.values;
    let newdataArray = dataArray.map(function(r){
        r.push(r[0] + '-' + r[1]);
        return r;
    });
    console.log(newdataArray);

    const updateOptions = {
        spreadsheetId: '11OLzmcRk5G8H49RQi1gCkuPyZavndyDBAQSwne4Zz5Y',
        range: 'Data!E2',
        valueInputOption: 'USER_ENTERED',
        resource: { values: newdataArray}
    };
    let res = await gsapi.spreadsheets.values.update(updateOptions);
    console.log(res);
}