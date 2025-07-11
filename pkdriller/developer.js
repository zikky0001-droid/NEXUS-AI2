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
    nomCom: "developer",
    categorie: "Info"
  },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;
    const { time, date, day } = getTimeAndDate();

    const message = `*👨‍💻 NEXUS AI - Developer Info*
━━━━━━━━━━━━━━━
*🧑‍🔧 Developer:* _PkDriller_
*🔗 GitHub:* github.com/pkdriller0
*🌐 Website:* nexus-ai.tech
*💬 WhatsApp:* wa.me/254794146821
*🛠️ Framework:* Zokou | Baileys
*🕓 Time:* ${time}
*📅 Date:* ${date} (${day})
*🌍 Region:* East Africa / Kenya
━━━━━━━━━━━━━━━
🔗 *Support Channel:* wa.me/254794146821?text=.support
📢 *Repo:* github.com/pkdriller0/NEXUS-AI
━━━━━━━━━━━━━━━
_💡 Trusted by over 100+ devs worldwide!_

*#NexusAI | #PkDriller | #Unmatched*`;

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
              displayName: "PkDriller 🧠",
              vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:PkDriller\nORG:Nexus AI\nTEL;type=CELL;type=VOICE;waid=254701000001:+254 701 000001\nEND:VCARD",
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
            title: "PkDriller - Nexus AI Dev",
            body: "Tap here to explore more tools",
            thumbnailUrl: "https://telegra.ph/file/4ac123b041f26a.png",
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true,
            sourceUrl: conf.URL,
            mediaUrl: conf.GURL
          }
        }
      }
    );

    await zk.sendMessage(
      dest,
      { text: message },
      { quoted: ms }
    );
  }
);
