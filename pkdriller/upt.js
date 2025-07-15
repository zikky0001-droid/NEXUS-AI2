const os = require("os");
const moment = require("moment-timezone");
const { zokou } = require("../framework/zokou");
const conf = require("../set");

moment.tz.setDefault(conf.TZ);

function formatUptime(ms) {
  const sec = Math.floor((ms / 1000) % 60);
  const min = Math.floor((ms / (1000 * 60)) % 60);
  const hrs = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  return `${days}d ${hrs}h ${min}m ${sec}s`;
}

const startTime = Date.now();

zokou(
  {
    nomCom: "uptime",
    categorie: "Core",
  },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;
    const uptime = formatUptime(Date.now() - startTime);
    const now = moment();
    const time = now.format("HH:mm:ss");
    const date = now.format("dddd, MMMM Do YYYY");

    const fakeVerified = {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
      },
      message: {
        contactMessage: {
          displayName: "Nexus Verified",
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Nexus;Verified;;;\nFN:Nexus Verified\nORG:Nexus-AI Inc.\nTEL;type=CELL;type=VOICE;waid=1234567890:+1 234 567 890\nEND:VCARD`,
        },
      },
    };

    await zk.sendMessage(
      dest,
      {
        text: `🤖 *NEXUS-AI Uptime*\n\n⏱️ *Uptime:* ${uptime}\n📆 *Date:* ${date}\n🕒 *Time:* ${time}`,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363288304618280@newsletter",
            newsletterName: "Nexus System",
          },
          externalAdReply: {
            title: "NEXUS-AI STATUS",
            body: `Running for ${uptime}`,
            mediaType: 1,
            previewType: "PHOTO",
            renderLargerThumbnail: true,
            thumbnailUrl:
              "https://github.com/nexustech1911/NEXUS-XMD-DATA/raw/refs/heads/main/logo/1d694055a8e0c692f5cdf56027b12741.jpg",
            sourceUrl: conf.URL || "https://github.com/nexustech1911/NEXUS-AI",
          },
        },
      },
      { quoted: fakeVerified }
    );
  }
);
