const util = require('util');
const fs = require('fs-extra');
const axios = require('axios');
const { zokou } = require("../framework/zokou");
const os = require('os');
const moment = require('moment-timezone');
const conf = require(__dirname + '/../set');

moment.tz.setDefault(conf.TZ);
const AUDIO_URL = 'https://github.com/PKDRILLER/files/raw/main/camera.mp3';

function getTimeAndDate() {
  const time = moment().format("HH:mm:ss");
  const date = moment().format("YYYY-MM-DD");
  return { time, date };
}

zokou({
  nomCom: "webss",
  categorie: "🌐 Tools"
}, async (dest, zk, commandeOptions) => {
  const { ms, arg } = commandeOptions;
  const { time, date } = getTimeAndDate();

  if (!arg[0]) {
    return zk.sendMessage(dest, {
      text: "📸 Usage: .webss <website_url>\nExample: .webss https://example.com",
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "Website Screenshot",
          body: "Capture a full preview of any site",
          thumbnailUrl: 'https://telegra.ph/file/abcd1234.jpg',
          mediaType: 1,
          sourceUrl: 'https://github.com/PKDRILLER'
        }
      }
    }, { quoted: ms });
  }

  const site = encodeURIComponent(arg[0]);
  const shot = `https://image.thum.io/get/fullpage/${site}`;

  await zk.sendMessage(dest, {
    image: { url: shot },
    caption: `🖼 Screenshot of:\n${arg[0]}\n\n📅 ${date} 🕒 ${time}`,
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      externalAdReply: {
        title: "Website Screenshot",
        body: "Preview generated successfully",
        thumbnailUrl: 'https://telegra.ph/file/abcd1234.jpg',
        mediaType: 1,
        renderLargerThumbnail: true,
        sourceUrl: arg[0]
      }
    }
  }, { quoted: ms });

  await zk.sendMessage(dest, {
    audio: { url: AUDIO_URL },
    mimetype: 'audio/mp4',
    ptt: true
  }, { quoted: ms });
});
