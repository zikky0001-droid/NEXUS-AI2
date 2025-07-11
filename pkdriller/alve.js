const util = require('util');
const fs = require('fs-extra');
const axios = require('axios');
const { zokou } = require(__dirname + "/../framework/zokou");
const os = require('os');
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");
moment.tz.setDefault(conf.TZ);
const { getTimeAndDate } = require(__dirname + "/../lib/myfunc");

const AUDIO_URL = "https://github.com/Bruno-Tshibangu/Zokou-Md/raw/main/media/alive.mp3";

const fakeContact = {
  key: {
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast",
    fromMe: false
  },
  message: {
    contactMessage: {
      displayName: "Zokou Verified",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:Zokou Verified\nORG:Zokou Inc.\nTEL;type=CELL;type=VOICE;waid=254700000000:+254 700 000000\nEND:VCARD",
      jpegThumbnail: fs.readFileSync(__dirname + "/../media/verified.jpg"),
      isFromMe: false
    }
  }
};

zokou({
  nomCom: "alive",
  categorie: "General"
}, async (dest, zk, commandeOptions) => {
  const { date, heure } = getTimeAndDate();

  const msg = `🟢 *Zokou Bot Alive*\n\n📅 Date: ${date}\n🕒 Time: ${heure}\n💻 Host: ${os.hostname()}\n📡 Platform: ${os.platform()}\n🔋 Uptime: ${Math.floor(os.uptime() / 60)} mins`;

  await zk.sendMessage(dest, {
    audio: { url: AUDIO_URL },
    mimetype: 'audio/mp4',
    ptt: true,
    caption: msg,
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363025736684314@newsletter',
        serverMessageId: '102',
        newsletterName: 'Zokou Bot'
      },
      externalAdReply: {
        title: "🤖 Bot Status: Alive",
        body: "Zokou is working perfectly",
        thumbnailUrl: conf.IMAGE_MENU,
        sourceUrl: conf.CHANNEL,
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: true
      }
    }
  }, { quoted: fakeContact });
});
