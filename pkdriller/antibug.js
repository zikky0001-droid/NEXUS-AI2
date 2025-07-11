const util = require('util');
const fs = require('fs-extra');
const axios = require('axios');
const { zokou } = require("../framework/zokou");
const os = require('os');
const moment = require('moment-timezone');
const conf = require(__dirname + '/../set');

moment.tz.setDefault(conf.TZ);
const AUDIO_URL = 'https://github.com/PKDRILLER/files/raw/main/alert.mp3';

const badPatterns = [/[\u200e\u202e\u2066-\u2069]/g]; // RTL, LRM, etc.

function getTimeAndDate() {
  const time = moment().format("HH:mm:ss");
  const date = moment().format("YYYY-MM-DD");
  return { time, date };
}

zokou({
  nomCom: "antibug",
  categorie: "🛡️ Security"
}, async (dest, zk, commandeOptions) => {
  const { ms, arg } = commandeOptions;
  const { time, date } = getTimeAndDate();
  const path = `./database/antibug/${dest}.json`;

  if (!ms.key.fromMe) return;

  if (arg[0] === "on") {
    await fs.ensureFile(path);
    await fs.writeJson(path, { status: true });
    await zk.sendMessage(dest, {
      audio: { url: AUDIO_URL },
      mimetype: 'audio/mp4',
      ptt: true,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "AntiBug Activated",
          body: `${date} | ${time}`,
          thumbnailUrl: 'https://telegra.ph/file/abcd1234.jpg',
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: 'https://github.com/PKDRILLER'
        }
      }
    }, { quoted: ms });
  } else if (arg[0] === "off") {
    await fs.remove(path);
    await zk.sendMessage(dest, {
      audio: { url: AUDIO_URL },
      mimetype: 'audio/mp4',
      ptt: true,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "AntiBug Deactivated",
          body: `${date} | ${time}`,
          thumbnailUrl: 'https://telegra.ph/file/abcd1234.jpg',
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: 'https://github.com/PKDRILLER'
        }
      }
    }, { quoted: ms });
  } else {
    await zk.sendMessage(dest, {
      text: "Usage: .antibug on/off",
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "AntiBug System",
          body: "Filter and auto-delete bug messages",
          thumbnailUrl: 'https://telegra.ph/file/abcd1234.jpg',
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: 'https://github.com/PKDRILLER'
        }
      }
    }, { quoted: ms });
  }
});
