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

zokou({ nomCom: "kick", categorie: "Admin" }, async (dest, zk, commandeOptions) => {
  const { ms, mentions, isGroup, isAdmin, isBotAdmin, repondre } = commandeOptions;

  if (!isGroup) return repondre("👥 *Group only command.*");
  if (!isAdmin) return repondre("🚫 *You must be an admin.*");
  if (!isBotAdmin) return repondre("⚠️ *I need admin rights to kick users.*");
  if (!mentions || mentions.length === 0) return repondre("📌 *Mention a user to kick.*");

  try {
    await zk.groupParticipantsUpdate(dest, mentions, "remove");

    await zk.sendMessage(dest, {
      audio: { url: AUDIO_URL },
      mimetype: "audio/mp4",
      ptt: true,
      text: `👢 *User removed successfully.*`,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "NEXUS-AI",
          serverMessageId: 152
        },
        externalAdReply: {
          title: "KICKED ❌",
          body: "By NEXUS Admin Tool",
          thumbnailUrl: THUMBNAIL_URL,
          sourceUrl: conf.GURL,
          mediaType: 1
        }
      }
    }, { quoted: ms });

  } catch (e) {
    console.log("❌ Kick Command Error: " + e);
    repondre("❌ Failed to remove user.");
  }
});
