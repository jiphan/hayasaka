// command functions

function ping() {
    console.log('ping from lib');
    return 'pong!';
}

function sheet() {
    return 'https://docs.google.com/spreadsheets/d/1V1TXuBip74BkEXaP20XDW7-uxa7B8xrRZpyhLMRlH8A';
}

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