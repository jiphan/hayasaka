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

export async function add_video(yClient, playlist_id, video_id, recents) {
    const gsapi = google.youtube({version: 'v3', auth: yClient});
    gsapi.playlistItems.insert({
        part: "snippet",
        resource: {
            snippet: {
                playlistId: playlist_id,
                resourceId: {
                    kind: "youtube#video",
                    videoId: YouTubeGetID(video_id)
                }
            }
        }
    })
    recents.push([await get_title(video_id), `http://youtu.be/${YouTubeGetID(video_id)}`]);
    if(recents.length > 5) recents.splice(0, 1);
    return recents;
}

export async function get_playlist(yClient, playlist_id) {
    const gsapi = google.youtube({version: 'v3', auth: yClient});
    let result = await gsapi.playlistItems.list({
        part: 'snippet,contentDetails',
        playlistId: playlist_id
    });
    let clean = [];
    result.data.items.forEach(async a=> {
        clean.push([decode(a.snippet.title), `http://youtu.be/${a.contentDetails.videoId}`]);
    });
    return clean;
}

/**
* Get YouTube ID from various YouTube URL
* @author: takien
* @url: http://takien.com
* For PHP YouTube parser, go here http://takien.com/864
*/
function YouTubeGetID(url){
    var ID = '';
    url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if(url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];
    }
    else {
      ID = url;
    }
      return ID;
  }

