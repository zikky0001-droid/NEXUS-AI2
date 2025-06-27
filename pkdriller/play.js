const { zokou } = require("../framework/zokou");
const axios = require("axios");
const ytSearch = require("yt-search");

zokou({
  nomCom: "play",
  aliases: ["song", "playdoc", "audio", "mp3"],
  categorie: "Search",
  reaction: "🎧"
}, async (sender, bot, commande) => {
  const { arg, ms, repondre } = commande;
  if (!arg[0]) {
    return repondre("Please provide a video name.");
  }

  const videoName = arg.join(" ");
  try {
    const searchResults = await ytSearch(videoName);
    if (!searchResults || !searchResults.videos.length) {
      return repondre("No video found for the specified query.");
    }

    const video = searchResults.videos[0];
    const videoUrl = video.url;

    const downloadAudio = async (url) => {
      try {
        const response = await axios.get(url);
        return response.data;
      } catch (error) {
        console.error("Error fetching data from API:", error);
        return { success: false };
      }
    };

    const apiUrls = [
      `https:                                                                           
      `//cobalt.tools/api/convert?url=${encodeURIComponent(videoUrl)}&type=audio`,
      `https://api.snaptube.app/v1/convert?url=${encodeURIComponent(videoUrl)}&format=mp3`,
      `https:                                                                            
      `//api.flvto.biz/api/convert?url=${encodeURIComponent(videoUrl)}&format=mp3`,
      `https://api.ytmp3.io/api/convert?url=${encodeURIComponent(videoUrl)}`,
      `https:                                                                     
    ];

    let audioData;
    for (const apiUrl of apiUrls) {
      audioData = await downloadAudio(apiUrl);
      if (audioData && audioData.success) {
        break;
      }
    }

    if (!audioData || !audioData.success) {
      return repondre("Failed to retrieve download URL from all sources. Please try again later.");
    }

    const downloadUrl = audioData.result.download_url;
    const audioMetadata = audioData.result;

    const message = {
      caption: `//api.convert2mp3.io/api/convert?url=${encodeURIComponent(videoUrl)}`
    ];

    let audioData;
    for (const apiUrl of apiUrls) {
      audioData = await downloadAudio(apiUrl);
      if (audioData && audioData.success) {
        break;
      }
    }

    if (!audioData || !audioData.success) {
      return repondre("Failed to retrieve download URL from all sources. Please try again later.");
    }

    const downloadUrl = audioData.result.download_url;
    const audioMetadata = audioData.result;

    const message = {
      caption: `\n*CHARLESKE-XMD DOWNLOADER*\n\n*Title: ${audioMetadata.title}*\n*Quality: High*\n*Duration: ${video.timestamp}*\n> *®Charleske-xmd Player* \n`,
      document: { url: downloadUrl },
      mimetype: "audio/mpeg",
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363351653122969@newsletter",
          newsletterName: "CHARLESKE-XMD",
          serverMessageId: 0x8f
        },
        forwardingScore: 0x3e7,
        externalAdReply: {
          title: "®Charleske",
          body: "YouTube Search",
          thumbnailUrl: "https:                               
          sourceUrl: "//files.catbox.moe/xv5h54.jpg",
          sourceUrl: "https://whatsapp.com/channel/0029Vao2hgeChq6HJ5bmlZ3K",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    };

    await bot.sendMessage(sender, message, { quoted: ms });
  } catch (error) {
    console.error("Error during download process:", error);
    return repondre("Download failed due to an error: " + (error.message || error));
  }
});
