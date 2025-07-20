zokou({ nomCom: "monitor_antilink", fromMe: false }, async (dest, zk, commandeOptions) => {
  const { ms, verifGroupe, infosGroupe, sender } = commandeOptions;
  const groupId = ms.key.remoteJid;

  if (!verifGroupe || !antilinkGroups.includes(groupId)) return;

  const body =
    ms.message?.conversation ||
    ms.message?.extendedTextMessage?.text ||
    "";

  const linkRegex = /https?:\/\/[^\s]+/gi;
  if (linkRegex.test(body)) {
    try {
      await zk.sendMessage(dest, { delete: ms.key });
      await zk.groupParticipantsUpdate(dest, [sender], "remove");

      await zk.sendMessage(dest, {
        text: `🚨 Link detected and user has been removed!`,
        mentions: [sender]
      });
    } catch (err) {
      console.error("❌ Antilink error:", err);
    }
  }
});
                    
