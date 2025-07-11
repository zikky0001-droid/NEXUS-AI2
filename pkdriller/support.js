const util = require("util");
const fs = require("fs-extra");
const axios = require("axios");
const { zokou } = require("../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");
const conf = require("../set");

moment.tz.setDefault(conf.TZ);

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/nexus.mp3";

// Helper
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

    const fakeVerifiedContact = {
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
├ 🌐 *Website:*  
│  https://nexusai.tech
│
├ 💻 *GitHub Repo:*  
│  https://github.com/nexustech1911/NEXUS-XMD
│
├ 📢 *WhatsApp Channel:*  
│  https://whatsapp.com/channel/0029Vad7YNyJuyA77CtIPX0x
│
├ 💬 *Developer Contact:*  
│  wa.me/254794146821
│
├ 💰 *Donate / Support:*  
│  https://buymeacoffee.com/nexusai
│
╰─🕘 *Updated:* ${time} - ${full}
`;

    await zk.sendMessage(
      dest,
      {
        image: { url: "https://telegra.ph/file/b9d2a57ebd17d3e7c6b7e.jpg" },
        caption,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363025076860999@newsletter",
            newsletterName: "Zokou Engine",
            serverMessageId: "",
          },
          externalAdReply: {
            title: "Support Nexus AI",
            body: "Click to access resources & help",
            mediaType: 1,
            previewType: "PHOTO",
            thumbnailUrl: "https://telegra.ph/file/b9d2a57ebd17d3e7c6b7e.jpg",
            renderLargerThumbnail: true,
            sourceUrl: conf.URL || "https://github.com/nexustech1911/NEXUS-XMD",
          },
        },
      },
      { quoted: fakeVerifiedContact }
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
            thumbnailUrl: "https://telegra.ph/file/b9d2a57ebd17d3e7c6b7e.jpg",
            renderLargerThumbnail: true,
            sourceUrl: conf.URL,
          },
        },
      },
      { quoted: fakeVerifiedContact }
    );
  }
);
