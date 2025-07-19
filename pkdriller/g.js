const { zokou } = require("../framework/zokou");
const axios = require('axios');
const ytSearch = require('yt-search');
const conf = require(__dirname + '/../set');

// Fake Verification vCard
const fakeContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "FREDI-EZRA",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nN:FREDI-EZRA;;;\nFN:FREDI-EZRA\nORG:FREDI-EZRA BOT;\nTEL;type=CELL;type=VOICE;waid=254700000000:+254 700 000000\nEND:VCARD`,
      jpegThumbnail: null
    }
  }
};

// Context Info
const getContextInfo = (title = '', userJid = '', thumbnailUrl = '', sourceUrl = '') => ({
  mentionedJid: [userJid],
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363313124070136@newsletter",
    newsletterName: "@FrediEzra Tech",
    serverMessageId: Math.floor(100000 + Math.random() * 900000)
  },
  externalAdReply: {
    showAdAttribution: true,
    title: conf.BOT || 'Music Downloader',
    body: title || "Media Downloader",
    thumbnailUrl: thumbnailUrl || conf.URL || '',
    sourceUrl: sourceUrl || '',
    mediaType: 1,
    renderLargerThumbnail: false
  }
});

// Search Functions
const searchSpotify = async (query) => {
  try {
    const response = await axios.get(`https://apis-keith.vercel.app/search/spotify?q=${encodeURIComponent(query)}`);
    return response.data?.status && response.data.result?.length ? { platform: 'spotify', ...response.data.result[0] } : null;
  } catch {
    return null;
  }
};

const searchSoundCloud = async (query) => {
  try {
    const response = await axios.get(`https://apis-keith.vercel.app/search/soundcloud?q=${encodeURIComponent(query)}`);
    const tracks = response.data?.result?.result?.filter(track => track.timestamp) || [];
    return tracks.length ? { platform: 'soundcloud', ...tracks[0] } : null;
  } catch {
    return null;
  }
};

const searchYouTube = async (query) => {
  try {
    const { videos } = await ytSearch(query);
    return videos?.length ? { platform: 'youtube', title: videos[0].title, url: videos[0].url, thumbnail: videos[0].thumbnail } : null;
  } catch {
    return null;
  }
};

// Download Functions
const downloadSpotify = async (url) => {
  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/d/spotify?url=${encodeURIComponent(url)}`);
    return response.data?.status && response.data.data?.download
      ? { downloadUrl: response.data.data.download, format: 'mp3', artist: response.data.data.artis, thumbnail: response.data.data.image }
      : null;
  } catch {
    return null;
  }
};

const downloadSoundCloud = async (url) => {
  try {
    const response = await axios.get(`https://apis-keith.vercel.app/download/soundcloud?url=${encodeURIComponent(url)}`);
    return response.data?.status && response.data.result?.track?.downloadUrl
      ? { downloadUrl: response.data.result.track.downloadUrl, format: 'mp3' }
      : null;
  } catch {
    return null;
  }
};

const downloadYouTube = async (url) => {
  try {
    const response = await axios.get(`https://apis-keith.vercel.app/download/dlmp3?url=${encodeURIComponent(url)}`);
    return response.data?.status && response.data.result?.downloadUrl
      ? { downloadUrl: response.data.result.downloadUrl, format: 'mp3' }
      : null;
  } catch {
    return null;
  }
};

// Zokou Command
zokou(
  {
    nomCom: "play3",
    categorie: "Downloads",
    reaction: "🎵",
    aliases: ["song", "audio", "mp3", "playdoc"]
  },
  async (dest, zk, commandeOptions) => {
    const { arg, ms, repondre, userJid } = commandeOptions;

    if (!arg[0]) return repondre("Please provide a song name or URL.");

    const query = arg.join(" ");
    let track, downloadData;

    // Platform priority
    const platforms = [];
    if (query.includes('youtube.com') || query.includes('youtu.be')) platforms.push('youtube');
    if (query.includes('soundcloud.com')) platforms.push('soundcloud');
    if (query.includes('spotify.com')) platforms.push('spotify');
    if (platforms.length === 0) platforms.push('youtube', 'soundcloud', 'spotify');

    for (const platform of platforms) {
      try {
        const searchFn = { youtube: searchYouTube, soundcloud: searchSoundCloud, spotify: searchSpotify }[platform];
        track = await searchFn(query);
        if (!track) continue;

        const downloadFn = { youtube: downloadYouTube, soundcloud: downloadSoundCloud, spotify: downloadSpotify }[platform];
        downloadData = await downloadFn(track.url);
        if (downloadData) break;
      } catch (error) {
        console.error(`${platform} error:`, error);
        continue;
      }
    }

    if (!track || !downloadData) {
      return repondre("❌ Failed to find or download the track from all platforms.");
    }

    const artist = downloadData.artist || track.artist || 'Unknown Artist';
    const thumbnail = downloadData.thumbnail || track.thumbnail || track.thumb || '';
    const fileName = `${track.title} - ${artist}.${downloadData.format}`.replace(/[^\w\s.-]/gi, '');

    try {
      await zk.sendMessage(dest, {
        audio: { url: downloadData.downloadUrl },
        mimetype: 'audio/mp4',
        contextInfo: getContextInfo(track.title, userJid, thumbnail, track.url)
      }, { quoted: fakeContact });

      await zk.sendMessage(dest, {
        document: { url: downloadData.downloadUrl },
        mimetype: `audio/${downloadData.format}`,
        fileName: fileName,
        caption: `📁 *${track.title}* by ${artist} (Document)`,
        contextInfo: getContextInfo(track.title, userJid, thumbnail, track.url)
      }, { quoted: fakeContact });

    } catch (error) {
      console.error('Sending error:', error);
      repondre("⚠️ Track downloaded but failed to send. Please try again.");
    }
  }
);
