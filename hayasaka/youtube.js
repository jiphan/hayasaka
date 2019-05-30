import { google } from 'googleapis';
const ytdl = require('ytdl-core');
const decode = require('unescape');

export async function get_title(url) {
    let info = await ytdl.getInfo(url);
    return info.title;
}

export async function get_results(yClient, search) {
    const gsapi = google.youtube({version:'v3', auth: yClient })
    let result = await gsapi.search.list({
        part: 'snippet',
        q: search,
        type: 'video',
    });
    let clean = [];
    result.data.items.forEach(async a=> {
        clean.push([decode(a.snippet.title), `http://youtu.be/${a.id.videoId}`]);
    });
    return clean;
}

export async function get_info(yClient, id, info) {
    const gsapi = google.youtube({version:'v3', auth: yClient })
    let result = await gsapi.videos.list({
        part: 'statistics',
        id: id
    })
    switch(info) {
        case 'views':
            return result.data.items[0].statistics.viewCount;
        case 'title':
            return result.data.items[0].snippet.title;
        default:
            break;
    }
}