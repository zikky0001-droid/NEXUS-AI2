const util = require('util');
const fs = require('fs-extra');
const axios = require('axios');
const { zokou } = require(__dirname + "/../framework/zokou");
const os = require('os');
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");
moment.tz.setDefault(conf.TZ);
const { getTimeAndDate } = require(__dirname + "/../lib/myfunc");

const AUDIO_URL = "https://files.catbox.moe/6zqdrk.mp3";

const fakeContact = {
  key: {
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast",
    fromMe: false
  },
  message: {
    contactMessage: {
      displayName: "Zokou Verified",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:Zokou Verified\nORG:Zokou Inc.\nTEL;type=CELL;type=VOICE;waid=254794146821:+254 941 46821\nEND:VCARD",
      jpegThumbnail: fs.readFileSync(__dirname + "/../media/verified.jpg"),
      isFromMe: false
    }
  }
};

zokou({
  nomCom: "speed",
  categorie: "General"
}, async (dest, zk, commandeOptions) => {
  const { date, heure } = getTimeAndDate();
  const start = Date.now();
  await zk.sendMessage(dest, { text: "🏃 Measuring speed..." });
  const speed = Date.now() - start;

  await zk.sendMessage(dest, {
    audio: { url: AUDIO_URL },
    mimetype: 'audio/mp4',
    ptt: true,
    caption: `⚡ Speed: ${speed}ms\n📅 ${date} | 🕒 ${heure}`,
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363288304618280@newsletter',
        serverMessageId: '101',
        newsletterName: 'NEXUS-AI'
      },
      externalAdReply: {
        title: "⚡ Speed Test",
        body: `📍 Latency: ${speed}ms`,
        thumbnailUrl: conf.IMAGE_MENU,
        sourceUrl: conf.CHANNEL,
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: true
      }
    }
  }, { quoted: fakeContact });
});
