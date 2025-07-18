const moment = require("moment-timezone");
const { zokou } = require("../framework/zokou");
const conf = require("../set");

moment.tz.setDefault(conf.TZ || "Africa/Nairobi");

function getTime() {
  const now = moment();
  return {
    time: now.format("HH:mm:ss"),
    date: now.format("dddd, MMMM Do YYYY"),
  };
}

zokou(
  {
    nomCom: "tagadmins",
    categorie: "Group",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, groupMetadata, isGroup } = commandeOptions;

    if (!isGroup) {
      return await zk.sendMessage(dest, { text: "❌ This command can only be used in groups." });
    }

    const admins = groupMetadata.participants
      .filter((p) => p.admin)
      .map((p) => p.id);

    if (admins.length === 0) {
      return await zk.sendMessage(dest, { text: "⚠️ No admins found in this group." });
    }

    const mentionText = admins.map((id, i) => `🛡️ Admin ${i + 1}: @${id.split("@")[0]}`).join("\n");
    const { time, date } = getTime();

    // Send the tagged message
    await zk.sendMessage(
      dest,
      {
        text: `📢 *ADMIN ALERT*\n\n${mentionText}\n\n🕒 Time: *${time}*\n📆 Date: *${date}*`,
        mentions: admins,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          mentionedJid: admins,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363288304618280@newsletter",
            newsletterName: "Nexus Group Notify",
          },
          externalAdReply: {
            title: "NEXUS-AI Admin Tagger",
            body: `Tagged ${admins.length} admins | ${time}`,
            mediaType: 1,
            previewType: "PHOTO",
            renderLargerThumbnail: true,
            thumbnailUrl:
              "https://github.com/nexustech1911/NEXUS-XMD-DATA/raw/refs/heads/main/logo/1d694055a8e0c692f5cdf56027b12741.jpg",
            sourceUrl: conf.URL || "https://github.com/nexustech1911/NEXUS-AI",
          },
        },
      },
      {
        quoted: {
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
        },
      }
    );
  }
);
