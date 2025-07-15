const util = require("util");
const fs = require("fs-extra");
const axios = require("axios");
const { zokou } = require("../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");
const conf = require("../set");

moment.tz.setDefault(conf.TZ);

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/nexus.mp3";

// Helper function
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
    nomCom: "ping",
    categorie: "Core",
  },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;
    const { time, full } = getTimeAndDate();

    const fakeMetaContact = {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
      },
      message: {
        contactMessage: {
          displayName: "Nexus Verified",
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;Meta;;;\nFN:Meta\nORG:Nexus Verified Inc\nTEL;type=CELL;type=VOICE;waid=1234567890:+1 234 567 890\nEND:VCARD`,
        },
      },
    };

    await zk.sendMessage(
      dest,
      {
        audio: {
          url: AUDIO_URL,
        },
        mimetype: "audio/mp4",
        ptt: true,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363288304618280@newsletter",
            newsletterName: "Nexus System",
            serverMessageId: "",
          },
          externalAdReply: {
            title: "Zokou Ping System",
            body: `✅ ${time} | ${full}`,
            mediaType: 1,
            previewType: "PHOTO",
            renderLargerThumbnail: true,
            thumbnailUrl: "https://github.com/nexustech1911/NEXUS-XMD-DATA/raw/refs/heads/main/logo/1d694055a8e0c692f5cdf56027b12741.jpg",
            sourceUrl: conf.URL || "https://github.com/nexustech1911/NEXUS-XMD",
          },
        },
      },
      { quoted: fakeMetaContact }
    );
  }
);
          
