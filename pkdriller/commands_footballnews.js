const { zokou } = require(__dirname + "/../framework/zokou");
const axios = require('axios');
const conf = require(__dirname + "/../set");

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/football.mp3";
const THUMBNAIL_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/nexus-ai.jpeg";

zokou({ nomCom: "football", categorie: "News" }, async (dest, zk, commandeOptions) => {
    let { ms } = commandeOptions;
    try {
        // Example: Use a public football news API or RSS feed
        // This example uses a fake endpoint, replace with a real API!
        const { data } = await axios.get("https://api.sportsdata.io/v3/soccer/scores/json/News", {
            headers: { "Ocp-Apim-Subscription-Key": conf.FOOTBALL_API_KEY }
        });
        let news = data.slice(0, 3).map(n => `⚽ ${n.Title}\n${n.Content}\n`).join('\n');
        if (!news) news = "No recent football news found.";
        await zk.sendMessage(dest, {
            audio: { url: AUDIO_URL },
            mimetype: 'audio/mp4',
            ptt: true,
            text: news,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363288304618280@newsletter',
                    newsletterName: 'NEXUS-AI',
                    serverMessageId: 183
                },
                externalAdReply: {
                    title: "Football News",
                    body: "Latest football updates worldwide.",
                    thumbnailUrl: THUMBNAIL_URL,
                    sourceUrl: conf.GURL,
                    mediaType: 1
                }
            }
        }, { quoted: ms });
    } catch (e) {
        console.log("❌ Football Command Error: " + e);
        if (typeof repondre === "function") repondre("❌ Error: " + e);
    }
});