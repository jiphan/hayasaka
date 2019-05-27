import { google } from 'googleapis';

export function msg_parse(args) {
    let i = what_div(args);
    if(i === -1) return [args.slice(1).join(' '), '', ''];
    let title = args.slice(1, i).join(' ');
    let source = args.slice(i + 1).join(' ');
    return [title, source, args[i]];    // [stand by me, sarazanmai, from]
}

export function what_div(args) {
    let div = ['from', 'by', '|'];
    let divi = ''
    args.forEach(a =>{
        div.forEach(d =>{
            if(a === d) divi = a;
        })
    });
    return args.lastIndexOf(divi);
}

export async function gsappend(gClient, row, spreadsheet_id, spreadsheet_dst){
    row.pop();
    const gsapi = google.sheets({version:'v4', auth: gClient })
    const update = {
        spreadsheetId: spreadsheet_id,
        range: spreadsheet_dst,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [ row ], }
    };
    let res = await gsapi.spreadsheets.values.append(update);
    // console.log(res.statusText);
}