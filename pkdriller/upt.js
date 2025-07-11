const util = require('util');
const fs = require('fs-extra');
const axios = require('axios');
const { zokou } = require(__dirname + "/../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/nexus.mp3";
const THUMBNAIL_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/nexus-ai.jpeg";

moment.tz.setDefault(`${conf.TZ}`);

const getTimeAndDate = () => {
    return {
        time: moment().format('HH:mm:ss'),
        date: moment().format('DD/MM/YYYY')
    };
};

const formatUptime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
};

zokou({ nomCom: "uptime", categorie: "Tools" }, async (dest, zk, commandeOptions) => {
    let { ms } = commandeOptions;
    const { time, date } = getTimeAndDate();
    const uptime = process.uptime();

    try {
        await zk.sendMessage(dest, {
            text: `⏳ *Bot Uptime*\n\n🔁 Uptime: *${formatUptime(Math.floor(uptime))}*\n📅 Date: ${date}\n🕓 Time: ${time}`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363288304618280@newsletter',
                    newsletterName: 'NEXUS-AI',
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: "Bot Uptime Monitor",
                    body: "Check how long Nexus bot has been active.",
                    thumbnailUrl: THUMBNAIL_URL,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    sourceUrl: conf.GURL
                }
            }
        }, { quoted: ms });

        await zk.sendMessage(dest, {
            audio: { url: AUDIO_URL },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: ms });

    } catch (e) {
        console.log("❌ Uptime Command Error: " + e);
        await zk.sendMessage(dest, { text: "❌ Error in uptime command." }, { quoted: ms });
    }
});
                       
