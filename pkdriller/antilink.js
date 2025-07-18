const { zokou } = require("../framework/zokou");
const { getData, saveData } = require("../bdd/antilien"); // you already use this
const config = require("../set");
const moment = require("moment-timezone");
moment.tz.setDefault(config.TZ);

zokou(
  {
    nomCom: "antilink",
    categorie: "Group",
    reaction: "🧷"
  },
  async (dest, zk, { arg, ms, repondre, auteur, verifGroupe, verifAdmin, superUser }) => {
    if (!verifGroupe) return repondre("📛 This command only works in groups.");
    if (!verifAdmin && !superUser) return repondre("🛡️ Only admins can use this command.");

    const option = arg[0];
    if (!option || !['on', 'off'].includes(option.toLowerCase())) {
      return repondre("⚙️ Usage: `.antilink on` or `.antilink off`");
    }

    const isOn = option.toLowerCase() === "on";
    await saveData(dest, isOn); // Save status to DB

    const confirmation = `🔗 Anti-Link has been *${isOn ? "ENABLED" : "DISABLED"}* for this group.`;

    const fakeContact = {
      contactMessage: {
        displayName: "NEXUS-AI",
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:NEXUS-XMD\nORG:NEXUS OFFICIAL;\nTEL;type=CELL;type=VOICE;waid=254700000000:+254 700 000000\nEND:VCARD`
      }
    };

    const msg = await zk.sendMessage(dest, {
      image: { url: "https://files.catbox.moe/4ycuuw.jpg" },
      caption: confirmation,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        mentionedJid: [auteur],
        externalAdReply: {
          title: "🔗 NEXUS-AI Anti-Link Module",
          body: moment().format("dddd, MMMM Do YYYY"),
          thumbnailUrl: "https://files.catbox.moe/4ycuuw.jpg",
          sourceUrl: config.GROUP_LINK || "https://chat.whatsapp.com/",
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true
        },
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "NEXUS TECH",
          serverMessageId: "999"
        },
        quotedMessage: fakeContact
      }
    }, { quoted: ms });

    // ⏱️ Auto-delete reply after 8 seconds
    await new Promise(resolve => setTimeout(resolve, 8000));
    await zk.sendMessage(dest, { delete: msg.key });
  }
);
