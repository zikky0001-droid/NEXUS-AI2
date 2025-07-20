const { zokou } = require("../framework/zokou");
const fs = require("fs");

const antilinkFile = "./xmd/antilink.json";

// Load existing data
let antilinkGroups = fs.existsSync(antilinkFile)
  ? JSON.parse(fs.readFileSync(antilinkFile))
  : [];

function saveAntilink() {
  fs.writeFileSync(antilinkFile, JSON.stringify(antilinkGroups, null, 2));
}

// Main antilink toggle command
zokou({
  nomCom: "antilink",
  categorie: "NEXUS-Group",
  reaction: "🚫"
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
    return repondre("❌ *Only admins or superusers can use this.*");
  }

  const action = arg[0];

  if (!["on", "off"].includes(action)) {
    return repondre("⚙️ *Usage:* antilink on / off");
  }

  const groupId = ms.key.remoteJid;

  if (action === "on") {
    if (!antilinkGroups.includes(groupId)) {
      antilinkGroups.push(groupId);
      saveAntilink();
    }
    return repondre("✅ *Antilink has been activated in this group.*");
  } else {
    antilinkGroups = antilinkGroups.filter(id => id !== groupId);
    saveAntilink();
    return repondre("❌ *Antilink has been deactivated in this group.*");
  }
});
      
