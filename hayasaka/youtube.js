const ytdl = require('ytdl-core');

export async function get_title(url) {
    let info = await ytdl.getInfo(url);
    return info.title;
}