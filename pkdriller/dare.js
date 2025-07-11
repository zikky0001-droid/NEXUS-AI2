const util = require("util");
const fs = require("fs-extra");
const axios = require("axios");
const { zokou } = require(__dirname + "/../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/nexus.mp3";
const THUMBNAIL_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/nexus-ai.jpeg";

moment.tz.setDefault(`${conf.TZ}`);

zokou({ nomCom: "dare", categorie: "Fun" }, async (dest, zk, commandeOptions) => {
  const { ms } = commandeOptions;

  const dares = [
    "Send a voice note singing your favorite song.",
    "Change your name to 'Baby Goat' for 1 day.",
    "Call your crush and say 'I love you'.",
    "Act like a robot in a voice note.",
    "Confess something you've never told anyone."
  ];
  const selected = dares[Math.floor(Math.random() * dares.length)];

  try {
    await zk.sendMessage(dest, {
      audio: { url: AUDIO_URL },
      mimetype: "audio/mp4",
      ptt: true,
      text: `🔥 *Dare Challenge:*\n${selected}`,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "NEXUS-AI",
          serverMessageId: 150
        },
        externalAdReply: {
          title: "DARE MODE 🔥",
          body: "Fun with NEXUS",
          thumbnailUrl: THUMBNAIL_URL,
          sourceUrl: conf.GURL,
          mediaType: 1
        }
      }
    }, { quoted: ms });
  } catch (e) {
    console.log("❌ Dare Command Error: " + e);
  }
});
