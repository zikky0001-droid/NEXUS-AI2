const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + '/../framework/zokou');
const os = require('os');
const axios = require('axios');
const moment = require('moment-timezone');
const conf = require(__dirname + '/../set');

moment.tz.setDefault(conf.TZ);

function getTimeAndDate() {
  const date = moment().format("MMMM Do YYYY");
  const time = moment().format("h:mm:ss a");
  return `${date} • ${time}`;
}

zokou({
  nomCom: "groupintel",
  categorie: "Group"
}, async (dest, zk, commandeOptions) => {
  const { ms, metadata } = commandeOptions;

  if (!metadata || !metadata.participants) {
    return zk.sendMessage(dest, {
      text: "❌ This command only works in groups.",
    }, { quoted: ms });
  }

  const groupName = metadata.subject || "Unknown";
  const groupId = metadata.id || dest;
  const memberCount = metadata.participants.length;
  const admins = metadata.participants.filter(p => p.admin);
  const adminList = admins.map(a => `@${a.id.split('@')[0]}`).join(', ');
  const owner = metadata.owner ? `@${metadata.owner.split('@')[0]}` : "Not detected";
  const creation = metadata.creation ? moment(metadata.creation * 1000) : moment();
  const groupAgeDays = moment().diff(creation, 'days');

  let safetyLevel = "✅ Safe";
  if (memberCount < 10 || groupAgeDays < 3) safetyLevel = "⚠️ New/Small Group";
  if (admins.length === 0) safetyLevel = "❌ No Admins - Unsafe";

  const fakeContact = {
    key: {
      fromMe: false,
      participant: `0@s.whatsapp.net`,
      ...(ms.key.remoteJid ? { remoteJid: ms.key.remoteJid } : {})
    },
    message: {
      contactMessage: {
        displayName: "Group Intelligence",
        vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:Group Monitor\nORG:Zokou Tools;\nTEL;type=CELL;type=VOICE;waid=254700000000:+254 700 000000\nEND:VCARD"
      }
    }
  };

  const contextInfo = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363288304618280@newsletter",
      newsletterName: "Group Insights",
      serverMessageId: "",
    },
    externalAdReply: {
      showAdAttribution: true,
      title: "Zokou Group Intel",
      body: getTimeAndDate(),
      mediaType: 1,
      renderLargerThumbnail: true,
      thumbnailUrl: conf.GURL,
      mediaUrl: conf.URL,
      sourceUrl: conf.URL
    },
    mentionedJid: admins.map(a => a.id)
  };

  const infoText = `🧠 *GROUP INTELLIGENCE REPORT*\n\n` +
    `📛 *Name:* ${groupName}\n` +
    `🆔 *ID:* ${groupId}\n` +
    `👥 *Members:* ${memberCount}\n` +
    `👮 *Admins:* ${admins.length}\n` +
    `🧑‍✈️ *Owner:* ${owner}\n` +
    `📆 *Created:* ${creation.format("Do MMMM YYYY")}\n` +
    `📈 *Age:* ${groupAgeDays} days\n` +
    `🔒 *Status:* ${safetyLevel}\n\n` +
    `📌 *Admin List:*\n${adminList || "No admins found"}`;

  await zk.sendMessage(dest, {
    text: infoText,
    contextInfo
  }, { quoted: fakeContact });
});
