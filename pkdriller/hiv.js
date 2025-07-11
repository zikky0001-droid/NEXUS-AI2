const util = require('util');
const fs = require('fs-extra');
const axios = require('axios');
const { zokou } = require(__dirname + '/../framework/zokou');
const os = require('os');
const moment = require('moment-timezone');
const conf = require(__dirname + '/../set');

moment.tz.setDefault(conf.TZ);

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/audio/hivresult.mp3"; // Replace if needed

function getTimeAndDate() {
  const date = moment().format("MMMM Do YYYY");
  const time = moment().format("h:mm:ss a");
  return `${date} • ${time}`;
}

zokou({
  nomCom: "hivtest",
  categorie: "Fun"
}, async (dest, zk, commandeOptions) => {
  const { ms } = commandeOptions;

  const contactMsg = {
    key: {
      fromMe: false,
      participant: `0@s.whatsapp.net`,
      ...(ms.key.remoteJid ? { remoteJid: ms.key.remoteJid } : {})
    },
    message: {
      contactMessage: {
        displayName: "Ministry of Health",
        vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:Health Authority\nORG:WHO;\nTEL;type=CELL;type=VOICE;waid=254700000000:+254 700 000000\nEND:VCARD"
      }
    }
  };

  const contextInfo = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363288304618280@newsletter",
      newsletterName: "HIV Awareness Bot",
      serverMessageId: "",
    },
    externalAdReply: {
      showAdAttribution: true,
      title: "HIV TEST RESULT",
      body: getTimeAndDate(),
      mediaType: 1,
      renderLargerThumbnail: true,
      thumbnailUrl: conf.GURL,
      mediaUrl: conf.URL,
      sourceUrl: conf.URL
    }
  };

  await zk.sendMessage(dest, {
    text: "🧪 Have you ever gone for an HIV test?\n\n👉 Reply `.hivtest` to see your results instantly.",
    contextInfo
  }, { quoted: contactMsg });

  await new Promise(res => setTimeout(res, 2500));

  await zk.sendMessage(dest, {
    audio: { url: AUDIO_URL },
    mimetype: 'audio/mp4',
    ptt: true,
    contextInfo
  }, { quoted: ms });
});
                              
