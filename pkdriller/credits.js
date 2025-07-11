const util = require("util");
const fs = require("fs-extra");
const axios = require("axios");
const { zokou } = require(__dirname + "/../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/nexus.mp3";

moment.tz.setDefault(conf.TZ);

function getTimeAndDate() {
  const now = moment();
  return {
    time: now.format("HH:mm:ss"),
    date: now.format("DD/MM/YYYY"),
    day: now.format("dddd")
  };
}

zokou(
  {
    nomCom: "credits",
    categorie: "Info"
  },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;
    const { time, date, day } = getTimeAndDate();

    const message = `*🌟 BOT CREDITS - Nexus AI*
━━━━━━━━━━━━━━━
*👑 Main Developer:* PkDriller
*💡 Concept Lead:* Nexus Core Team
*🧪 Plugin Coders:* 
• PkDriller 🔧
• Ibrahim adams🤖
🇰🇪 🕊️

*📸 Thumbnail music:* nexus telegram bot
*🔐 Security Advisor:* Hans Tz
━━━━━━━━━━━━━━━
*💝 Special Thanks:*

• Ibrahim Adams
• Hans    Tz

*📅 ${day}, ${date}*
*⏰ ${time}*

🔗 GitHub: github.com/pkdriller0
🔗 Website: https://pkdriller-web.vercel.app/
━━━━━━━━━━━━━━━
_“Together we build unbreakable tools!”_

*#NexusAI | #PkDriller | #RespectTheCode*`;

    await zk.sendMessage(
      dest,
      {
        audio: { url: AUDIO_URL },
        mimetype: "audio/mp4",
        ptt: true
      },
      {
        quoted: {
          key: {
            fromMe: false,
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast"
          },
          message: {
            contactMessage: {
              displayName: "Nexus Dev Team",
              vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:Nexus Dev Team\nORG:Nexus AI\nTEL;type=CELL;type=VOICE;waid=254701000001:+254 701 000001\nEND:VCARD",
              isFromMe: false,
              isVerified: true
            }
          }
        },
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363288304618280@newsletter",
            newsletterName: "Nexus AI News"
          },
          externalAdReply: {
            title: "Credits - Powered by PkDriller",
            body: "Respect to all who build & support Nexus AI",
            thumbnailUrl: "https://files.catbox.moe/yptcae.jpg",
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: true,
            sourceUrl: conf.URL,
            mediaUrl: conf.GURL
          }
        }
      }
    );

    await zk.sendMessage(dest, { text: message }, { quoted: ms });
  }
);
         
