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

zokou({ nomCom: "truth", categorie: "Fun" }, async (dest, zk, commandeOptions) => {
  const { ms } = commandeOptions;

  const questions = [
    "Have you ever lied to your best friend?",
    "What's a secret you've never told anyone?",
    "Who was your first crush?",
    "What’s the most embarrassing thing you’ve ever done?",
    "Have you ever cheated in an exam?"
  ];
  const selected = questions[Math.floor(Math.random() * questions.length)];

  try {
    await zk.sendMessage(dest, {
      audio: { url: AUDIO_URL },
      mimetype: "audio/mp4",
      ptt: true,
      text: `🧠 *Truth Question:*\n${selected}`,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "NEXUS-AI",
          serverMessageId: 149
        },
        externalAdReply: {
          title: "TRUTH MODE 🔍",
          body: "Fun with NEXUS",
          thumbnailUrl: THUMBNAIL_URL,
          sourceUrl: conf.GURL,
          mediaType: 1
        }
      }
    }, { quoted: ms });
  } catch (e) {
    console.log("❌ Truth Command Error: " + e);
  }
});
