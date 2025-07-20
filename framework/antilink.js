zokou({ nomCom: "monitor_antilink", fromMe: false }, async (dest, zk, commandeOptions) => {
  const { ms, isGroup, sender } = commandeOptions;
  const text =
    ms?.message?.conversation ||
    ms?.message?.extendedTextMessage?.text ||
    "";

  if (!isGroup || !antilinkGroups.includes(dest)) return;

  const linkRegex = /https?:\/\/[^\s]+/gi;
  if (linkRegex.test(text)) {
    try {
      await zk.sendMessage(dest, { delete: ms.key });
      await zk.groupParticipantsUpdate(dest, [sender], "remove");
      zk.sendMessage(dest, { text: `🚫 Link detected and user removed.` });
    } catch (e) {
      console.error("Antilink error:", e);
    }
  }
});
