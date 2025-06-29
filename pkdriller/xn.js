const { zokou } = require("../framework/zokou");
const axios = require('axios');
const ytSearch = require('yt-search');
const conf = require(__dirname + '/../set');

// Define the command with aliases for play
zokou({
  nomCom: "play3",
  aliases: ["song", "playdoc", "audio", "mp3"],
  categorie: "Search",
  reaction: "🎧"
}, async (dest, zk, commandOptions) => {
  const { arg, ms, repondre } = commandOptions;

  // Check if a query is provided
  if (!arg[0]) {
    return repondre("Please provide a video name.");
  }

  const query = arg.join(" ");

  try {
    // Perform a YouTube search based on the query
    const searchResults = await ytSearch(query);

    // Check if any videos were found
    if (!searchResults || !searchResults.videos.length) {
      return repondre('No video found for the specified query.');
    }

    const firstVideo = searchResults.videos[0];
    const videoUrl = firstVideo.url;

    // Use the ochinpo-helper API
    const res = await fetch(`https://ochinpo-helper.hf.space/yt?query=${encodeURIComponent(query)}`);
    const downloadData = await res.json();

    // Check if a valid download URL was found
    if (!downloadData || !downloadData.success) {
      return repondre('Failed to retrieve download URL. Please try again later.');
    }

    const downloadUrl = downloadData.result.download_url;
    const videoDetails = downloadData.result;

    // Prepare the message payload with external ad details
    const messagePayloads = [
      {
       caption: `\n*NEXUS DOWNLOADER*\n
 *Title: ${videoDetails.title}*
 *Quality: High*
 *Duration: ${firstVideo.timestamp}*
> *Nexus ai Player* 
`,
       document: { url: downloadUrl },
       mimetype: 'audio/mpeg',
       contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
          newsletterJid: '120363288304618280@newsletter',
          newsletterName: "NEXUS TECH",
          serverMessageId: 143,
          },
          forwardingScore: 999, // Score to indicate it has been forwarded
          externalAdReply: {
            title: "PkDriller",
            body: "YouTube Search",
            thumbnailUrl: 'https://files.catbox.moe/bkv0b4.jpg', // Add thumbnail URL if required 
            sourceUrl: 'https://whatsapp.com/channel/0029Vad7YNyJuyA77CtIPX0x', // Add source URL if necessary
            mediaType: 1,
            renderLargerThumbnail: true
          },
        },
      },
      {
        audio: { url: downloadUrl },
        mimetype: 'audio/mp4',
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
          newsletterJid: '120363288304618280@newsletter',
          newsletterName: "NEXUS-AI",
          serverMessageId: 143,
          },
          forwardingScore: 999, // Score to indicate it has been forwarded
          externalAdReply: {
            title: "PkDriller",
            body: "YouTube Search",
            thumbnailUrl: 'https://files.catbox.moe/bkv0b4.jpg', // Add thumbnail URL if required 
            sourceUrl: 'https://whatsapp.com/channel/0029Vad7YNyJuyA77CtIPX0x', // Add source URL if necessary
            mediaType: 1,
            renderLargerThumbnail: true
          },
        },
      }
    ];

    // Send the download link to the user for each payload
    for (const messagePayload of messagePayloads) {
      await zk.sendMessage(dest, messagePayload, { quoted: ms });
    }

  } catch (error) {
    console.error('Error during download process:', error);
    return repondre(`Download failed due to an error: ${error.message || error}`);
  }
});
