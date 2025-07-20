const { zokou } = require("../framework/zokou");

zokou({
  nomCom: "tagall",
  categorie: "NEXUS-Group",
  reaction: "📢"
}, async (dest, zk, commandeOptions) => {
  const {
    ms,
    repondre,
    arg,
    verifGroupe,
    infosGroupe,
    nomAuteurMessage,
    nomGroupe,
    verifAdmin,
    superUser
  } = commandeOptions;

  if (!verifGroupe) {
    return repondre("🚫 *This command is for groups only.*");
  }

  if (!(verifAdmin || superUser)) {
    return repondre("❌ *You must be an admin or superuser to use this.*");
  }

  const membres = infosGroupe.participants || [];
  const message = arg.length > 0 ? arg.join(" ") : "⚠️ Attention, everyone!";
  const emojis = ['🔰', '⚡', '📢', '🚨', '✅', '🔊', '🎯', '🧠'];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  let broadcast = `╭───⟪ *NEXUS-AI ✅ TAGALL* ⟫───╮\n`;
  broadcast += `│ 🏷️ *Group:* ${nomGroupe}\n`;
  broadcast += `│ 👤 *By:* ${nomAuteurMessage}\n`;
  broadcast += `│ 💬 *Message:* ${message}\n`;
  broadcast += `╰────────────⟪ ${randomEmoji} ⟫\n\n`;

  membres.forEach((m) => {
    broadcast += `${randomEmoji} @${m.id.split("@")[0]}\n`;
  });

  // Fake verified vCard + status style quoting
  const fakeQuote = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
    },
    message: {
      contactMessage: {
        displayName: "NEXUS-AI ✅",
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:NEXUS-AI ✅\nORG:Nexus Verified\nTEL;type=CELL;waid=1234567890:+1 234 567 890\nEND:VCARD`,
      },
    },
  };

  await zk.sendMessage(dest, {
    text: broadcast,
    mentions: membres.map((u) => u.id),
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      mentionedJid: membres.map((u) => u.id),
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363288304618280@newsletter",
        newsletterName: "NEXUS SYSTEM ✅",
      },
      externalAdReply: {
        title: "Group Broadcast by NEXUS-AI ✅",
        body: "📢 Powered by NEXUS-AI Engine",
        mediaType: 1,
        thumbnailUrl: "https://github.com/nexustech1911/NEXUS-XMD-DATA/raw/refs/heads/main/logo/1d694055a8e0c692f5cdf56027b12741.jpg",
        renderLargerThumbnail: true,
        sourceUrl: "https://github.com/nexustech1911/NEXUS-AI",
      }
    }
  }, { quoted: fakeQuote });
});
    
