const util = require("util");
const fs = require("fs-extra");
const axios = require("axios");
const { zokou } = require(__dirname + "/../framework/zokou");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/nexus.mp3";
const THUMBNAIL_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/nexus-ai.jpeg";

moment.tz.setDefault(`${conf.TZ}`);

zokou({ nomCom: "spam", categorie: "Fun" }, async (dest, zk, commandeOptions) => {
  const { ms, arg, repondre } = commandeOptions;

  if (arg.length < 2) return repondre("🔁 *Usage:* .spam [count] [text]");

  const count = parseInt(arg[0]);
  if (isNaN(count) || count > 50) return repondre("❌ *Spam limit is 50 messages max.*");

  const text = arg.slice(1).join(" ");

  for (let i = 0; i < count; i++) {
    await zk.sendMessage(dest, {
      text,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "NEXUS-AI",
          serverMessageId: 168
        }
      }
    });
  }

  await zk.sendMessage(dest, {
    audio: { url: AUDIO_URL },
    mimetype: "audio/mp4",
    ptt: true,
    text: `✅ *Spam sent ${count} times!*`,
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363288304618280@newsletter",
        newsletterName: "NEXUS-AI",
        serverMessageId: 169
      },
      externalAdReply: {
        title: "SPAMMER 🔁",
        body: "Use responsibly. Powered by NEXUS.",
        thumbnailUrl: THUMBNAIL_URL,
        sourceUrl: conf.GURL,
        mediaType: 1
      }
    }
  }, { quoted: ms });
});
