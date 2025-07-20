const { zokou } = require("../framework/zokou");
const fs = require("fs");

const antilinkFile = "./database/antilink.json";

// Load antilink group settings
let antilinkGroups = fs.existsSync(antilinkFile)
  ? JSON.parse(fs.readFileSync(antilinkFile))
  : [];

// Save to file
function saveAntilink() {
  fs.writeFileSync(antilinkFile, JSON.stringify(antilinkGroups, null, 2));
}

// Command to turn antilink on/off
zokou({ nomCom: "antilink", categorie: "group", reaction: "🚫" }, async (dest, zk, commandeOptions) => {
  const { ms, arg, isGroup, superUser, groupAdmins, userSender, msgRepondu } = commandeOptions;

  if (!isGroup) return zk.sendMessage(dest, { text: "❌ This command works only in groups!" }, { quoted: ms });

  if (!groupAdmins.includes(userSender) && !superUser) {
    return zk.sendMessage(dest, { text: "❌ Only admins can use this command." }, { quoted: ms });
  }

  const action = arg[0];
  if (!["on", "off"].includes(action)) {
    return zk.sendMessage(dest, { text: "🔒 Usage: antilink on / off" }, { quoted: ms });
  }

  if (action === "on") {
    if (!antilinkGroups.includes(dest)) {
      antilinkGroups.push(dest);
      saveAntilink();
    }
    zk.sendMessage(dest, { text: "✅ Antilink has been *activated*." }, { quoted: ms });
  } else if (action === "off") {
    antilinkGroups = antilinkGroups.filter(groupId => groupId !== dest);
    saveAntilink();
    zk.sendMessage(dest, { text: "❌ Antilink has been *deactivated*." }, { quoted: ms });
  }
});

// Monitor messages to detect links
zokou({ nomCom: "monitor_antilink", fromMe: false }, async (dest, zk, commandeOptions) => {
  const { ms, isGroup, sender, msgType } = commandeOptions;
  const messageText = ms?.message?.conversation || ms?.message?.extendedTextMessage?.text || "";

  if (!isGroup || !antilinkGroups.includes(dest)) return;

  // Detect links
  const linkRegex = /https?:\/\/[^\s]+/gi;
  if (linkRegex.test(messageText)) {
    try {
      // Delete the message
      await zk.sendMessage(dest, { delete: ms.key });

      // Remove member
      await zk.groupParticipantsUpdate(dest, [sender], "remove");

      await zk.sendMessage(dest, { text: `🚫 Link detected and user removed.` });
    } catch (err) {
      console.error("Antilink error:", err);
    }
  }
});
      
