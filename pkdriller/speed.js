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

const getTimeAndDate = () => ({
    time: moment().format('HH:mm:ss'),
    date: moment().format('DD/MM/YYYY')
});

zokou({ nomCom: "speed", categorie: "General" }, async (dest, zk, commandeOptions) => {
    let { ms } = commandeOptions;
    const { time, date } = getTimeAndDate();
    const start = performance.now();

    try {
        const end = performance.now();
        const speed = (end - start).toFixed(2);

        await zk.sendMessage(dest, {
            audio: { url: AUDIO_URL },
            mimetype: 'audio/mp4',
            ptt: true,
            text: `⚡ Speed Test\n📶 Response: ${speed} ms\n🕒 ${time} | 📅 ${date}`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363288304618280@newsletter',
                    newsletterName: 'NEXUS-AI',
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: "Speed Test 💨",
                    body: "Bot is running fast and smooth!",
                    thumbnailUrl: conf.URL,
                    sourceUrl: conf.GURL,
                    mediaType: 1
                }
            }
        }, { quoted: ms });
    } catch (e) {
        console.log("❌ Speed Command Error: " + e);
    }
});
