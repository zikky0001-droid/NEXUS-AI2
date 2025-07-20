const { zokou } = require("../framework/zokou");
const fs = require("fs");

const antilinkFile = "./xmd/antilink.json";

// Load antilink group settings
let antilinkGroups = fs.existsSync(antilinkFile)
  ? JSON.parse(fs.readFileSync(antilinkFile))
  : [];

// Save changes
function saveAntilink() {
  fs.writeFileSync(antilinkFile, JSON.stringify(antilinkGroups, null, 2));
}

// Antilink command
zokou({ nomCom: "antilink", categorie: "group", reaction: "🚫" }, async (dest, zk, commandeOptions) => {
  const { ms, arg, superUser, groupMetadata, userSender } = commandeOptions;
  const groupId = ms.key.remoteJid;
  const isGroup = groupId.endsWith("@g.us");

  if (!isGroup) {
    return zk.sendMessage(dest, { text: "❌ This command works only in groups!" }, { quoted: ms });
  }

  const groupAdmins = groupMetadata.participants
    .filter(p => p.admin !== null)
    .map(p => p.id);

  if (!groupAdmins.includes(userSender) && !superUser) {
    return zk.sendMessage(dest, { text: "❌ Only admins can use this command." }, { quoted: ms });
  }

  const action = arg[0];
  if (!["on", "off"].includes(action)) {
    return zk.sendMessage(dest, { text: "🔒 Usage: antilink on / off" }, { quoted: ms });
  }

  if (action === "on") {
    if (!antilinkGroups.includes(groupId)) {
      antilinkGroups.push(groupId);
      saveAntilink();
    }
    zk.sendMessage(dest, { text: "✅ Antilink has been *activated* in this group." }, { quoted: ms });
  } else {
    antilinkGroups = antilinkGroups.filter(id => id !== groupId);
    saveAntilink();
    zk.sendMessage(dest, { text: "❌ Antilink has been *deactivated* in this group." }, { quoted: ms });
  }
});
                          
