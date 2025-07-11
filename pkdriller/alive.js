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

const getTimeAndDate = () => {
  return {
    time: moment().format("HH:mm:ss"),
    date: moment().format("DD/MM/YYYY")
  };
};

zokou({ nomCom: "nexus", categorie: "Tools" }, async (dest, zk, commandeOptions) => {
  const { ms } = commandeOptions;
  const { time, date } = getTimeAndDate();
  const uptime = Math.floor(process.uptime());

  try {
    await zk.sendMessage(dest, {
      audio: { url: AUDIO_URL },
      mimetype: "audio/mp4",
      ptt: true,
      text: `✅ *BOT IS ONLINE!*\n🕐 Time: ${time}\n📅 Date: ${date}\n⏱️ Uptime: ${uptime}s\n\n💠 Powered by NEXUS-AI`,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "NEXUS-AI",
          serverMessageId: 146
        },
        externalAdReply: {
          title: "NEXUS ALIVE ✅",
          body: "Stay connected with the bot",
          thumbnailUrl: THUMBNAIL_URL,
          sourceUrl: conf.GURL,
          mediaType: 1
        }
      }
    }, { quoted: ms });
  } catch (e) {
    console.log("❌ Alive Command Error: " + e);
  }
});
