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

zokou({ nomCom: "xvideos", categorie: "Adult" }, async (dest, zk, commandeOptions) => {
  const { ms, arg, repondre } = commandeOptions;

  if (!arg || !arg[0]) return repondre("🔞 *Enter a keyword to search on XVideos.*");

  try {
    const search = encodeURIComponent(arg.join(" "));
    const { data } = await axios.get(`https://aemt.me/xvideos?search=${search}`);
    if (!data || !data.result || !data.result[0]) return repondre("❌ No results found.");

    const res = data.result[0];

    await zk.sendMessage(dest, {
      video: { url: res.video_1 },
      caption: `🔞 *XVideos Result:*\n\n📹 ${res.title}\n👁️ Views: ${res.views}\n⏱ Duration: ${res.duration}`,
      mimetype: "video/mp4",
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "NEXUS-AI",
          serverMessageId: 157
        },
        externalAdReply: {
          title: "XVideos 🔥",
          body: "Adult Content via NEXUS",
          thumbnailUrl: res.thumb,
          sourceUrl: res.link,
          mediaType: 1
        }
      }
    }, { quoted: ms });

  } catch (e) {
    console.log("❌ XVideos Command Error: " + e);
    repondre("❌ Failed to get content.");
  }
});
