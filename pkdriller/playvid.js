const { zokou } = require("../framework/zokou");
const axios = require('axios');
const ytSearch = require('yt-search');
const conf = require(__dirname + '/../set');

// Define the command with aliases for video download
zokou({
  nomCom: "playvideo2",
  aliases: ["video", "mp4play", "ytvideo"],
  categorie: "Search",
  reaction: "📹"
}, async (dest, zk, commandOptions) => {
  const { arg, ms, repondre } = commandOptions;

  if (!arg[0]) {
    return repondre("Please provide a video name to search.");
  }

  const query = arg.join(" ");

  try {
    const searchResults = await ytSearch(query);

    if (!searchResults || !searchResults.videos.length) {
      return repondre('No video found for your query.');
    }

    const firstVideo = searchResults.videos[0];
    const videoUrl = firstVideo.url;
    const videoTitle = firstVideo.title;
    const videoDuration = firstVideo.timestamp;
    const videoThumb = firstVideo.thumbnail;

    // New API for MP4 video download
    const encodedUrl = encodeURIComponent(videoUrl);
    const apiUrl = `https://api.akuari.my.id/downloader/youtube?link=${encodedUrl}`;

    let downloadData;

    try {
      const res = await axios.get(apiUrl);
      downloadData = res.data;
    } catch (err) {
      console.error("API error:", err.message);
      return repondre("Failed to fetch video download link.");
    }

    if (!downloadData || !downloadData.result || !downloadData.result.url) {
      return repondre("Could not get a valid video download link.");
    }

    const downloadUrl = downloadData.result.url;

    const messagePayload = {
      video: { url: downloadUrl },
      caption: `\n*NEXUS VIDEO DOWNLOADER*\n
*Title:* ${videoTitle}
*Duration:* ${videoDuration}
*Powered by Nexus-AI*`,
      mimetype: 'video/mp4',
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363288304618280@newsletter',
          newsletterName: "NEXUS TECH",
          serverMessageId: 150,
        },
        forwardingScore: 999,
        externalAdReply: {
          title: "PkDriller",
          body: "YouTube Video Search",
          thumbnailUrl: videoThumb,
          sourceUrl: videoUrl,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    };

    await zk.sendMessage(dest, messagePayload, { quoted: ms });

  } catch (error) {
    console.error('Unexpected error:', error.message);
    return repondre(`Error: ${error.message || error}`);
  }
});
