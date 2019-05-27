import { google } from 'googleapis';

/**
 * Appends a row to the Google Sheet specified by conf.json
 * @param   {JWT}       gClient             Google JavaScript Web Token
 * @param   {string[]}  row                 Row to be appended
 * @param   {string}    spreadsheet_id      Document to append to
 * @param   {string}    spreadsheet_dst     Location in document to append
 */
export async function gsappend(gClient, row, spreadsheet_id, spreadsheet_dst){
    const gsapi = google.sheets({version:'v4', auth: gClient })
    const update = {
        spreadsheetId: spreadsheet_id,
        range: spreadsheet_dst,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [ row ], }
    };
    gsapi.spreadsheets.values.append(update);
}

/**
 * Parses a discord message into three fields
 * @param   {string}    args    Discord message to be parsed
 * @returns {string[]}          [title, separator, source]
 */
export function msg_parse(args) {
    let i = what_div(args);
    if(i === -1) return [args.slice(1).join(' '), '', ''];
    let title = args.slice(1, i).join(' ');
    let source = args.slice(i + 1).join(' ');
    return [title, args[i], source];    // [stand by me, from, sarazanmai]
}

function what_div(args) {
    let div = ['from', 'by', 'of', '|'];
    let divi = ''
    args.forEach(a =>{
        div.forEach(d =>{
            if(a === d) divi = a;
        })
    });
    return args.lastIndexOf(divi);
}

export async function gsmatch(gClient, spreadsheet_id, spreadsheet_dst) {
    const gsapi = google.sheets({version:'v4', auth: gClient })
    let result = await gsapi.spreadsheets.values.get({
        spreadsheetId: spreadsheet_id,
        range: spreadsheet_dst,
        majorDimension: 'ROWS'
    })
    return result.data.values;
}

export function query(arr, row) {
    let match = false
    arr.forEach(a =>{
        if(a[0] === row[0]) {
            if(a[1] === row[1]) match = true;
        }
    });
    if(match) return true;
}