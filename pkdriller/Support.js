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

zokou({ nomCom: "connect", categorie: "General" }, async (dest, zk, commandeOptions) => {
  let { ms } = commandeOptions;
  const { time, date } = getTimeAndDate();

  const text = `💬 *NEXUS-XMD Support Links*\n\n🌐 GitHub: https://github.com/pkdriller0\n📞 WhatsApp: wa.me/254794146821\n🔗 Group: https://chat.whatsapp.com/CbY7YiuobJ1AlMJ8PviKpm?mode=r_t`;

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
          title: "Need Help?",
          body: "Join our support group",
          thumbnailUrl: conf.URL,
          sourceUrl: conf.GURL,
          mediaType: 1,
        }
      }
    }, { quoted: ms });

    await zk.sendMessage(dest, { text }, { quoted: ms });

  } catch (e) {
    console.log("❌ Support Command Error:", e);
  }
});
