export.default = {
name: 'video',
category: 'download',
carryOut: async (nova, m, { react, args }) => {
if (!args) {
await react('🈵');
return m.reply('Provide a video name or URL please');
}

const url = args[0];
const videoTitle = args[1];

const ytdl = require('ytdl-core');
const yts = require('yt-search');

const ytRegex = `^https?:\/\/(?:www\.|m\.)(youtube\.com|youtu\.be)\/(?:watch\?v=|v\/|)([a-zA-Z0-9_-]+)$`;
if (!url.match(ytRegex)) {
return m.reply('Invalid YouTube URL');
}

try {
let info;

if (url.startsWith('https://') || url.startsWith('http://')) {
info = await ytdl.getInfo(url);
} else {
const searchResult = await yts.search(url);
info = await ytdl.getInfo(searchResult.videos[0].url);
}

const title = info.title;
const size = info.length;
const quality = info.formats[0].qualityLabel;

m.reply(`*_Downloading_*: ${title}...`);

const stream = ytdl(info.formats[0].url, {
filter: 'audioandvideo',
quality: 'highest',
});

const writer = nova.fs.createWriteStream(`${title}.${info.formats[0].ext}`);

stream.pipe(writer);

writer.on('finish', async () => {
await nova.sendMessage(m.chat, {
video: {
file: nova.fs.readFileSync(`${title}.${info.formats[0].ext}`),
filename: `${title}.${info.formats[0].ext}`,
},
caption: `*Title:${title}*\n*Size: ${size} seconds*\n*Quality: ${quality}*`,
externalAdReply: {
title: 'NovaBot',
body: 'vn_ext',
thumbnail: info.thumbnail,
},
  });
});
} catch (err) {
m.reply(`Error: ${err.message}`);
  }
 }
}
                 
