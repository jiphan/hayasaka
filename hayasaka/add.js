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
 * Parses a discord message into four fields
 * @param   {string}    args    Discord message to be parsed
 * @returns {string[]}          [title, separator, source, url]
 */
export function msg_parse(args) {
    let title = '';                    
    let div = '';
    let source = ' ';                   // placeholder string for query()
    let url = get_url(args);
    
    let i = what_div(args);
    if(i === -1) {
        title = args.slice(1).join(' ');
    } else{
        title = args.slice(1, i).join(' ');
        div = args[i];
        source = args.slice(i + 1).join(' ');
    }
    return [title, div, source, url];   // [OP, from, Blend-W, <url>]
}

function get_url(args) {
    let url = '';
    args.forEach(a =>{
        if(a.search('youtu') != -1) {   // youtube and youtu.be
            url = args.splice(args.indexOf(a), 1)[0];
        }
    });
    return url;
}

function what_div(args) {
    let div = ['from', 'by', 'of', '|']
    let divi = ''
    args.forEach(a =>{
        div.forEach(d =>{
            if(a === d) divi = a;
        })
    });
    return args.lastIndexOf(divi);
}

/**
 * Returns range in Google Sheet specified by conf.json
 * @param   {JWT}       gClient             Google JavaScript Web Token
 * @param   {string}    spreadsheet_id      Document to read from
 * @param   {string}    spreadsheet_dst     Range in document read from
 * @returns {string[]}                      [ [row1], [row2] ...]
 */
export async function gslookup(gClient, spreadsheet_id, spreadsheet_dst) {
    const gsapi = google.sheets({version:'v4', auth: gClient })
    let result = await gsapi.spreadsheets.values.get({
        spreadsheetId: spreadsheet_id,
        range: spreadsheet_dst,
        majorDimension: 'ROWS'
    })
    return result.data.values;
}

/**
 * Searches array 'arr' for matching 'row' (case insensitive)
 * @param   {string[][]}    arr     [ [row1], [row2] ...]
 * @param   {string[]}      row     [title, source, url]
 * @returns {boolean}               Both title and source match or url matches
 */
export function query(arr, row) {
    let match = false
    arr.forEach(a =>{
        if( a[0].toLowerCase() === row[0].toLowerCase() &&
            a[1].toLowerCase() === row[1].toLowerCase() ||
            a[2] === row[2]) match = true;
    });
    return match;
}