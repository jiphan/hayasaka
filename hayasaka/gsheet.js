import { google } from 'googleapis';

/**
 * Appends a row to the Google Sheet specified by conf.json
 * @param   {JWT}       gClient             Google JavaScript Web Token
 * @param   {string[]}  row                 Row to be appended
 * @param   {string}    spreadsheet_id      Document to append to
 * @param   {string}    spreadsheet_dst     Location in document to append
 */
export async function append(gClient, row, spreadsheet_id, spreadsheet_dst){
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
 * Returns range in Google Sheet specified by conf.json
 * @param   {JWT}       gClient             Google JavaScript Web Token
 * @param   {string}    spreadsheet_id      Document to read from
 * @param   {string}    spreadsheet_dst     Range in document read from
 * @returns {string[][]}                      [ [row1], [row2] ...]
 */
export async function lookup(gClient, spreadsheet_id, spreadsheet_dst) {
    const gsapi = google.sheets({version:'v4', auth: gClient })
    let result = await gsapi.spreadsheets.values.get({
        spreadsheetId: spreadsheet_id,
        range: spreadsheet_dst,
        majorDimension: 'ROWS'
    })
    return result.data.values;
}