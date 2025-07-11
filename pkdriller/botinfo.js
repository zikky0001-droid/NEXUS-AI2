const util = require('util');
const fs = require('fs-extra');
const axios = require('axios');
const { zokou } = require(__dirname + "/../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/nexus.mp3";
const THUMBNAIL_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/nexus-ai.jpeg";

moment.tz.setDefault(`${conf.TZ}`);

const getTimeAndDate = () => {
  return {
    time: moment().format('HH:mm:ss'),
    date: moment().format('DD/MM/YYYY')
  };
};

zokou({ nomCom: "botinfo", categorie: "General" }, async (dest, zk, commandeOptions) => {
  let { ms } = commandeOptions;
  const { time, date } = getTimeAndDate();
  const uptime = process.uptime();
  const ram = (os.totalmem() - os.freemem()) / 1024 / 1024;

  const text = `🤖 *Bot Information*\n\n⏰ Time: ${time}\n📅 Date: ${date}\n🔋 Uptime: ${Math.floor(uptime)}s\n💾 RAM Usage: ${ram.toFixed(2)} MB`;

  try {
    await zk.sendMessage(dest, {
      audio: { url: AUDIO_URL },
      mimetype: 'audio/mp4',
      ptt: true,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363288304618280@newsletter',
          newsletterName: 'NEXUS-AI',
          serverMessageId: 143
        },
        externalAdReply: {
          title: "NEXUS-AI STATUS",
          body: "Bot is running smoothly 🔥",
          thumbnailUrl: conf.URL,
          sourceUrl: conf.GURL,
          mediaType: 1,
        }
      }
    }, { quoted: ms });

    await zk.sendMessage(dest, { text }, { quoted: ms });

  } catch (e) {
    console.log("❌ BotInfo Error:", e);
  }
});
