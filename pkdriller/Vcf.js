const util = require("util");
const fs = require("fs-extra");
const { zokou } = require(__dirname + "/../framework/zokou");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

moment.tz.setDefault(conf.TZ);

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/nexus.mp3";
const THUMB_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/nexus-ai.jpeg";

const getTimeAndDate = () => ({
  time: moment().format("HH:mm:ss"),
  date: moment().format("DD/MM/YYYY")
});

zokou({ nomCom: "vcfbatch", categorie: "Tools" }, async (dest, zk, commandeOptions) => {
  const { ms, isGroup, metadata } = commandeOptions;

  if (!isGroup) {
    return zk.sendMessage(dest, {
      text: "❌ This command only works in groups."
    }, { quoted: ms });
  }

  const participants = metadata.participants || [];
  if (participants.length === 0) {
    return zk.sendMessage(dest, {
      text: "❌ Could not get group members."
    }, { quoted: ms });
  }

  try {
    const contacts = [];

    for (const user of participants) {
      const jid = user.id || user.jid;
      const phone = jid.split("@")[0];
      const name = (await zk.getName(jid).catch(() => null)) || `User ${phone}`;

      const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;type=CELL;type=VOICE;waid=${phone}:${phone}
END:VCARD
      `.trim();

      contacts.push({ vcard });
    }

    const displayName = metadata.subject || "Group Contacts";

    await zk.sendMessage(dest, {
      contacts: {
        displayName,
        contacts
      },
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363288304618280@newsletter',
          newsletterName: 'NEXUS-AI',
          serverMessageId: 143
        },
        externalAdReply: {
          title: "Exported Group Contacts 📤",
          body: `${contacts.length} vCards sent`,
          thumbnailUrl: THUMB_URL,
          sourceUrl: conf.GURL,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: ms });

    await zk.sendMessage(dest, {
      audio: { url: AUDIO_URL },
      mimetype: "audio/mp4",
      ptt: true
    }, { quoted: ms });

  } catch (err) {
    console.error("vcfbatch error:", err);
    await zk.sendMessage(dest, {
      text: "❌ Error exporting contacts."
    }, { quoted: ms });
  }
});
  
