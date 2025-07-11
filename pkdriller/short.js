const util = require("util");
const fs = require("fs-extra");
const axios = require("axios");
const { zokou } = require(__dirname + "/../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/nexus.mp3";
const THUMBNAIL_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/nexus-ai.jpeg";

moment.tz.setDefault(`${conf.TZ}`);

zokou({ nomCom: "short", categorie: "Tools" }, async (dest, zk, commandeOptions) => {
  const { ms, arg, repondre } = commandeOptions;

  if (!arg || !arg[0]) return repondre("🔗 *Please send a link to shorten.*");

  try {
    const link = arg[0];
    const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(link)}`);

    await zk.sendMessage(dest, {
      audio: { url: AUDIO_URL },
      mimetype: "audio/mp4",
      ptt: true,
      text: `🔗 *Shortened Link:*\n${res.data}`,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "NEXUS-AI",
          serverMessageId: 148
        },
        externalAdReply: {
          title: "Link Shortened!",
          body: "Via NEXUS tools",
          thumbnailUrl: THUMBNAIL_URL,
          sourceUrl: conf.GURL,
          mediaType: 1
        }
      }
    }, { quoted: ms });

  } catch (e) {
    console.log("❌ Short Command Error: " + e);
    repondre("❌ Failed to shorten the link.");
  }
});
