

/**
 * Parses a discord message into four fields
 * @param   {string}    args    Discord message to be parsed
 * @returns {string[]}          [title, separator, source, url]
 */
export function parse(args) {
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
    return [title, div, source, url];   // [Battle theme, of, Pokemon, <url>]
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
    let div = ['from', 'by', 'of']
    let divi = ''
    args.forEach(a =>{
        div.forEach(d =>{
            if(a === d) divi = a;
        })
    });
    return args.lastIndexOf(divi);
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

export function good(args) {
    switch(args[1]){
        case 'morning':
            return 'coffee kudasai'
        case 'night':
            return 'signing off~'
        default:
            return '???';
    }
}

export function rng(max) {
    return Math.ceil(Math.random() * max);
}