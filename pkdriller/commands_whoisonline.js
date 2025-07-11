const { zokou } = require(__dirname + "/../framework/zokou");
const conf = require(__dirname + "/../set");

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/online.mp3";
const THUMBNAIL_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/nexus-ai.jpeg";

zokou({ nomCom: "whoisonline", categorie: "Group" }, async (dest, zk, commandeOptions) => {
    let { ms } = commandeOptions;
    try {
        // Get group metadata and participants
        const metadata = await zk.groupMetadata(dest);
        const participants = metadata.participants || [];
        let onlineList = [];
        for (let member of participants) {
            if (member.isAdmin || member.id === zk.user.id) continue;
            // This is a placeholder; actual presence detection may depend on your WhatsApp API/library.
            if (zk.store?.presence?.[member.id]?.lastKnownPresence === "available") {
                onlineList.push(member.id.split('@')[0]);
            }
        }
        let response = onlineList.length
            ? `🟢 Online now:\n${onlineList.map(u => `@${u}`).join('\n')}`
            : "No group members seem online now.";
        await zk.sendMessage(dest, {
            audio: { url: AUDIO_URL },
            mimetype: 'audio/mp4',
            ptt: true,
            text: response,
            mentions: onlineList.map(u => u + "@s.whatsapp.net"),
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363288304618280@newsletter',
                    newsletterName: 'NEXUS-AI',
                    serverMessageId: 181
                },
                externalAdReply: {
                    title: "Who's Online?",
                    body: "See current group activity.",
                    thumbnailUrl: THUMBNAIL_URL,
                    sourceUrl: conf.GURL,
                    mediaType: 1
                }
            }
        }, { quoted: ms });
    } catch (e) {
        console.log("❌ WhoisOnline Command Error: " + e);
        if (typeof repondre === "function") repondre("❌ Error: " + e);
    }
});