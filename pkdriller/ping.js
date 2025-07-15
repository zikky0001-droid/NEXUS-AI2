const moment = require("moment-timezone");
const { zokou } = require("../framework/zokou");
const conf = require("../set");

moment.tz.setDefault(conf.TZ);

function getTime() {
  const now = moment();
  return {
    time: now.format("HH:mm:ss"),
    date: now.format("dddd, MMMM Do YYYY"),
  };
}

zokou(
  {
    nomCom: "ping",
    categorie: "Core",
  },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;
    const start = performance.now();

    // Send "initializing" message
    const init = await zk.sendMessage(
      dest,
      { text: "🔄 *Initializing NEXUS-AI System...*" },
      { quoted: {
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
        }
      }
    );

    // Wait 1.5 seconds to simulate system boot
    await new Promise((res) => setTimeout(res, 1500));

    const end = performance.now();
    const speed = (end - start).toFixed(2);
    const { time, date } = getTime();

    // Delete "initializing" message
    await zk.sendMessage(dest, { delete: init.key });

    // Send final ping result
    await zk.sendMessage(
      dest,
      {
        text: `✅ *NEXUS-AI SYSTEM ONLINE*\n\n🏓 Ping: *${speed} ms*\n🕒 Time: *${time}*\n📆 Date: *${date}*`,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363288304618280@newsletter",
            newsletterName: "Nexus System",
          },
          externalAdReply: {
            title: "NEXUS-AI Ping",
            body: `✅ ${speed} ms | ${time}`,
            mediaType: 1,
            previewType: "PHOTO",
            renderLargerThumbnail: true,
            thumbnailUrl:
              "https://github.com/nexustech1911/NEXUS-XMD-DATA/raw/refs/heads/main/logo/1d694055a8e0c692f5cdf56027b12741.jpg",
            sourceUrl: conf.URL || "https://github.com/nexustech1911/NEXUS-AI",
          },
        },
      },
      { quoted: init }
    );
  }
);
