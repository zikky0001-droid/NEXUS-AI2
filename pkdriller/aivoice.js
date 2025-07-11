const util = require('util');
const fs = require('fs-extra');
const axios = require('axios');
const { zokou } = require("../framework/zokou");
const os = require('os');
const moment = require('moment-timezone');
const conf = require(__dirname + '/../set');
const { exec } = require('child_process');
const path = require('path');

moment.tz.setDefault(conf.TZ);
const AUDIO_ALERT = 'https://github.com/PKDRILLER/files/raw/main/robot.mp3';

function getTimeAndDate() {
  const time = moment().format("HH:mm:ss");
  const date = moment().format("YYYY-MM-DD");
  return { time, date };
}

zokou({
  nomCom: "aivoice",
  categorie: "🎙 Voice"
}, async (dest, zk, commandeOptions) => {
  const { ms, arg } = commandeOptions;
  const { time, date } = getTimeAndDate();

  if (!arg || arg.length < 1) {
    return zk.sendMessage(dest, {
      text: "🗣 Usage: .aivoice <text>\nExample: .aivoice Hello human, I am your assistant.",
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "AI Voice",
          body: "Convert text into realistic voice",
          thumbnailUrl: 'https://telegra.ph/file/abcd1234.jpg',
          sourceUrl: 'https://github.com/PKDRILLER'
        }
      }
    }, { quoted: ms });
  }

  const query = encodeURIComponent(arg.join(" "));
  const voiceURL = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${query}`;

  try {
    await zk.sendMessage(dest, {
      audio: { url: voiceURL },
      mimetype: 'audio/mp4',
      ptt: true,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "🎧 AI Voice",
          body: `Spoken: ${arg.slice(0, 5).join(" ")}...`,
          thumbnailUrl: 'https://telegra.ph/file/abcd1234.jpg',
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: 'https://github.com/PKDRILLER'
        }
      }
    }, { quoted: ms });

    await zk.sendMessage(dest, {
      audio: { url: AUDIO_ALERT },
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: ms });

  } catch (e) {
    await zk.sendMessage(dest, {
      text: "❌ Failed to generate voice. Try again.",
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "AI Voice Error",
          body: "Text-to-Speech failed",
          thumbnailUrl: 'https://telegra.ph/file/abcd1234.jpg',
          sourceUrl: 'https://github.com/PKDRILLER'
        }
      }
    }, { quoted: ms });
  }
});const util = require('util');
const fs = require('fs-extra');
const axios = require('axios');
const { zokou } = require("../framework/zokou");
const os = require('os');
const moment = require('moment-timezone');
const conf = require(__dirname + '/../set');
const { exec } = require('child_process');
const path = require('path');

moment.tz.setDefault(conf.TZ);
const AUDIO_ALERT = 'https://github.com/PKDRILLER/files/raw/main/robot.mp3';

function getTimeAndDate() {
  const time = moment().format("HH:mm:ss");
  const date = moment().format("YYYY-MM-DD");
  return { time, date };
}

zokou({
  nomCom: "aivoice",
  categorie: "🎙 Voice"
}, async (dest, zk, commandeOptions) => {
  const { ms, arg } = commandeOptions;
  const { time, date } = getTimeAndDate();

  if (!arg || arg.length < 1) {
    return zk.sendMessage(dest, {
      text: "🗣 Usage: .aivoice <text>\nExample: .aivoice Hello human, I am your assistant.",
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "AI Voice",
          body: "Convert text into realistic voice",
          thumbnailUrl: 'https://telegra.ph/file/abcd1234.jpg',
          sourceUrl: 'https://github.com/PKDRILLER'
        }
      }
    }, { quoted: ms });
  }

  const query = encodeURIComponent(arg.join(" "));
  const voiceURL = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${query}`;

  try {
    await zk.sendMessage(dest, {
      audio: { url: voiceURL },
      mimetype: 'audio/mp4',
      ptt: true,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "🎧 AI Voice",
          body: `Spoken: ${arg.slice(0, 5).join(" ")}...`,
          thumbnailUrl: 'https://telegra.ph/file/abcd1234.jpg',
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: 'https://github.com/PKDRILLER'
        }
      }
    }, { quoted: ms });

    await zk.sendMessage(dest, {
      audio: { url: AUDIO_ALERT },
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: ms });

  } catch (e) {
    await zk.sendMessage(dest, {
      text: "❌ Failed to generate voice. Try again.",
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "AI Voice Error",
          body: "Text-to-Speech failed",
          thumbnailUrl: 'https://telegra.ph/file/abcd1234.jpg',
          sourceUrl: 'https://github.com/PKDRILLER'
        }
      }
    }, { quoted: ms });
  }
});
