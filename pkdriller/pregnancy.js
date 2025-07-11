const util = require('util');
const fs = require('fs-extra');
const axios = require('axios');
const { zokou } = require(__dirname + '/../framework/zokou');
const os = require('os');
const moment = require('moment-timezone');
const conf = require(__dirname + '/../set');

moment.tz.setDefault(conf.TZ);

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/audio/pregresult.mp3"; // Fake result voice

function getTimeAndDate() {
  const date = moment().format("MMMM Do YYYY");
  const time = moment().format("h:mm:ss a");
  return `${date} • ${time}`;
}

zokou({
  nomCom: "pregtest",
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
        displayName: "Pregnancy Check Center",
        vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:Pregnancy Test Center\nORG:Zokou Health;\nTEL;type=CELL;type=VOICE;waid=254700000000:+254 700 000000\nEND:VCARD"
      }
    }
  };

  const contextInfo = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363288304618280@newsletter",
      newsletterName: "PregTest Report",
      serverMessageId: "",
    },
    externalAdReply: {
      showAdAttribution: true,
      title: "PREGNANCY TEST RESULT",
      body: getTimeAndDate(),
      mediaType: 1,
      renderLargerThumbnail: true,
      thumbnailUrl: conf.GURL,
      mediaUrl: conf.URL,
      sourceUrl: conf.URL
    }
  };

  // Step 1: Initial test message
  await zk.sendMessage(dest, {
    text: "🧪 Pregnancy Test Kit Activated...\n\n⏳ Collecting sample...\nPlease wait...",
    contextInfo
  }, { quoted: contactMsg });

  // Wait 2.5 seconds
  await new Promise(res => setTimeout(res, 2500));

  // Step 2: Send result audio
  await zk.sendMessage(dest, {
    audio: { url: AUDIO_URL },
    mimetype: 'audio/mp4',
    ptt: true,
    contextInfo
  }, { quoted: ms });

  // Wait another 2.5 seconds
  await new Promise(res => setTimeout(res, 2500));

  // Step 3: Final result message
  const possibleResults = [
    "✅ Test complete: You are... 3 weeks pregnant! 👶",
    "⚠️ Test shows no signs of pregnancy. You're safe. 🚫👶",
    "🍼 Double lines detected... Twins confirmed! 😱",
    "❌ Test failed. Please don't move while peeing next time! 😂",
    "🤖 You are pregnant with... a robot baby? 🤔"
  ];
  const finalResult = possibleResults[Math.floor(Math.random() * possibleResults.length)];

  await zk.sendMessage(dest, {
    text: finalResult,
    contextInfo
  }, { quoted: ms });
});
                     
