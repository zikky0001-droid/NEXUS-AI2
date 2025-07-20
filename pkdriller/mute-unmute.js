const { zokou } = require("../framework/zokou");
const fs = require("fs");

const muteFile = "./xmd/onlyadmin.json";
let muteGroups = fs.existsSync(muteFile) ? JSON.parse(fs.readFileSync(muteFile)) : [];

function saveMute() {
  fs.writeFileSync(muteFile, JSON.stringify(muteGroups, null, 2));
}

zokou({
  nomCom: "mute",
  categorie: "NEXUS-Group",
  reaction: "🔇"
}, async (dest, zk, commandeOptions) => {
  const {
    ms,
    repondre,
    arg,
    verifGroupe,
    nomGroupe,
    nomAuteurMessage,
    verifAdmin,
    superUser
  } = commandeOptions;

  if (!verifGroupe) return repondre("🚫 *This command is for groups only.*");
  if (!(verifAdmin || superUser)) return repondre("❌ *Only admins or superusers can use this.*");

  const action = arg[0];
  const groupId = ms.key.remoteJid;

  if (!["on", "off"].includes(action)) {
    return repondre("🔧 *Usage:* onlyadmin on / off");
  }

  if (action === "on") {
    if (!muteGroups.includes(groupId)) {
      muteGroups.push(groupId);
      saveMute();
    }
    return repondre("🔒 *Only Admin Mode Activated!*");
  } else {
    muteGroups = muteGroups.filter(id => id !== groupId);
    saveMute();
    return repondre("🔓 *Only Admin Mode Deactivated!*");
  }
});
    
