const { zokou } = require("../framework/zokou");
const fs = require("fs");

const antilinkFile = "./xmd/onlyadmin.json";
let antilinkGroups = fs.existsSync(antilinkFile)
  ? JSON.parse(fs.readFileSync(antilinkFile))
  : [];

function saveAntilink() {
  fs.writeFileSync(antilinkFile, JSON.stringify(antilinkGroups, null, 2));
}

zokou({
  nomCom: "onlyadmin",
  categorie: "NEXUS-Group",
  reaction: "🔒"
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
    return repondre("⚙️ *Usage:* onlyadmin on / off");
  }

  const groupId = ms.key.remoteJid;

  if (action === "on") {
    if (!antilinkGroups.includes(groupId)) {
      antilinkGroups.push(groupId);
      saveAntilink();
    }
    return repondre("🔒 *Only Admin mode activated.*");
  } else {
    antilinkGroups = antilinkGroups.filter(id => id !== groupId);
    saveAntilink();
    return repondre("🔓 *Only Admin mode deactivated.*");
  }
});
  
