const util = require("util");
const fs = require("fs-extra");
const axios = require("axios");
const { zokou } = require("../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");
const conf = require("../set");

moment.tz.setDefault(conf.TZ);

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/nexus.mp3";

function getTimeAndDate() {
  const now = moment();
  return {
    time: now.format("HH:mm:ss"),
    date: now.format("YYYY-MM-DD"),
    full: now.format("dddd, MMMM Do YYYY"),
  };
}

zokou(
  {
    nomCom: "support",
    categorie: "Core",
  },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;
    const { time, full } = getTimeAndDate();

    const quotedContact = {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
      },
      message: {
        contactMessage: {
          displayName: "PKDRILLER Verified",
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:PKDRILLER;Bot;;;\nFN:PKDRILLER\nORG:Nexus AI - PKDRILLER\nTEL;type=CELL;type=VOICE;waid=254794146821:+254 794 146 821\nEND:VCARD`,
        },
      },
    };

    const caption = `
╭──〔 *🤖 Nexus AI Support Center* 〕──◆
│
├ 🌐 *Website:*  https://nexusai.tech
├ 💻 *GitHub:*    https://github.com/nexustech1911/NEXUS-XMD
├ 📢 *Channel:*   
├ 💬 *Contact:*   wa.me/254794146821
├ 💰 *Support:*   
╰─🕘 *Updated:* ${time} - ${full}`;

    await zk.sendMessage(
      dest,
      {
        image: { url: "http://files.catbox.moe/yptcae.jpg" },
        caption,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: "Support Nexus AI",
            body: "Click below to access help center",
            mediaType: 1,
            previewType: "PHOTO",
            thumbnailUrl: "https://telegra.ph/file/b9d2a57ebd17d3e7c6b7e.jpg",
            renderLargerThumbnail: true,
            sourceUrl: conf.URL || "https://github.com/nexustech1911/NEXUS-XMD",
          },
        },
      },
      { quoted: quotedContact }
    );

    await zk.sendMessage(
      dest,
      {
        audio: { url: AUDIO_URL },
        mimetype: "audio/mp4",
        ptt: true,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: "Zokou | PKDRILLER Verified",
            body: "Elite Nexus AI Support Plugin",
            mediaType: 1,
            previewType: "PHOTO",
            thumbnailUrl: "https://files.catbox.moe/yptcae.jpg",
            renderLargerThumbnail: true,
            sourceUrl: conf.URL || "https://github.com/nexustech1911/NEXUS-XMD",
          },
        },
      },
      { quoted: quotedContact }
    );
  }
);
        
