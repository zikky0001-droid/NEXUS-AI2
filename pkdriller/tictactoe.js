const util = require('util');
const fs = require('fs-extra');
const axios = require('axios');
const TicTacToe = require('../framework/tictactoe');
const { zokou } = require(__dirname + '/../framework/zokou');
const os = require('os');
const moment = require('moment-timezone');
const conf = require(__dirname + '/../set');

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/nexus.mp3";
const THUMBNAIL_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/nexus-ai.jpeg";

moment.tz.setDefault(conf.TZ);
const getTimeAndDate = () => ({
    time: moment().format('HH:mm:ss'),
    date: moment().format('DD/MM/YYYY')
});

const games = {};

zokou({ nomCom: "tictactoe", aliases: ["ttt"], categorie: "Games" }, async (dest, zk, commandeOptions) => {
    const { ms, arg, sender } = commandeOptions;
    const senderId = sender;

    const existing = Object.values(games).find(room =>
        room.id.startsWith("tictactoe") &&
        [room.game.playerX, room.game.playerO].includes(senderId)
    );

    if (existing) {
        return zk.sendMessage(dest, {
            text: "❌ You are already in a game. Type *surrender* to quit.",
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363288304618280@newsletter',
                    newsletterName: 'NEXUS-AI',
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: "TicTacToe Game Conflict",
                    body: "Already active — surrender first.",
                    thumbnailUrl: THUMBNAIL_URL,
                    sourceUrl: conf.GURL,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: ms });
    }

    let room = Object.values(games).find(room =>
        room.state === "WAITING" && (arg[0] ? room.name === arg.join(" ") : true)
    );

    if (room) {
        room.o = dest;
        room.game.playerO = senderId;
        room.state = "PLAYING";

        const board = room.game.render().map(v => ({
            'X': '❎', 'O': '⭕',
            '1': '1️⃣', '2': '2️⃣', '3': '3️⃣',
            '4': '4️⃣', '5': '5️⃣', '6': '6️⃣',
            '7': '7️⃣', '8': '8️⃣', '9': '9️⃣'
        }[v]));

        const { time, date } = getTimeAndDate();
        const message = `
🎮 *TicTacToe Game Started!*

🆚 @${room.game.playerX.split('@')[0]} vs @${room.game.playerO.split('@')[0]}
🎯 *Your Move:* @${room.game.currentTurn.split('@')[0]}

${board.slice(0, 3).join('')}
${board.slice(3, 6).join('')}
${board.slice(6).join('')}

📅 ${date} | 🕓 ${time}
Type a number (1-9) to move. Type *surrender* to quit.
`;

        await zk.sendMessage(dest, {
            text: message,
            mentions: [room.game.playerX, room.game.playerO],
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363288304618280@newsletter',
                    newsletterName: 'NEXUS-AI',
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: "Game In Progress 🎮",
                    body: "Classic TicTacToe via NEXUS",
                    thumbnailUrl: THUMBNAIL_URL,
                    sourceUrl: conf.GURL,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: ms });

        await zk.sendMessage(dest, {
            audio: { url: AUDIO_URL },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: ms });

    } else {
        room = {
            id: "tictactoe-" + Date.now(),
            x: dest,
            o: "",
            game: new TicTacToe(senderId, "o"),
            state: "WAITING"
        };
        if (arg[0]) room.name = arg.join(" ");
        games[room.id] = room;

        await zk.sendMessage(dest, {
            text: `⏳ *Waiting for opponent...*\nType *.ttt ${room.name || ''}* to join.`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363288304618280@newsletter',
                    newsletterName: 'NEXUS-AI',
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: "New Room Created 🧩",
                    body: "TicTacToe Room ID: " + room.id,
                    thumbnailUrl: THUMBNAIL_URL,
                    sourceUrl: conf.GURL,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: ms });
    }
});
          
