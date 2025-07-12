const util = require('util');
const fs = require('fs-extra');
const os = require('os');
const axios = require('axios');
const moment = require('moment-timezone');
const conf = require(__dirname + '/../set');
moment.tz.setDefault(conf.TZ);
const { zokou } = require(__dirname + '/../framework/zokou');

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/nexus.mp3";

let games = {};

function formatBoard(board) {
  return `
${board[0]} | ${board[1]} | ${board[2]}
---------
${board[3]} | ${board[4]} | ${board[5]}
---------
${board[6]} | ${board[7]} | ${board[8]}
`.replace(/null/g, ' ');
}

function checkWinner(board, player) {
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return wins.some(combo => combo.every(i => board[i] === player));
}

function isDraw(board) {
  return board.every(cell => cell !== null);
}

zokou({
  nomCom: 'ticatoe',
  categorie: 'game'
}, async (dest, zk, { ms, arg, quoted }) => {
  const sender = ms.sender;
  const mentioned = ms.mentionByTag[0];

  if (!mentioned) return zk.sendMessage(dest, {
    text: '*🎮 TICTACTOE GAME*\n\n_Tumia_ *.ticatoe @mtu* _kuanzisha game._',
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      externalAdReply: {
        title: 'NEXUS AI - TICTACTOE',
        mediaType: 2,
        mediaUrl: conf.URL,
        sourceUrl: conf.GURL,
        thumbnailUrl: conf.LOGO
      },
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363025983927370@newsletter',
        newsletterName: "Nexus XMD",
        serverMessageId: "10"
      }
    }
  }, { quoted: ms });

  const gameId = `${sender}:${mentioned}`;
  games[gameId] = {
    board: Array(9).fill(null),
    players: [sender, mentioned],
    turn: 0
  };

  await zk.sendMessage(dest, {
    text: `🎮 *TICTACTOE Game Started!*\n\n${ms.pushName} VS @${mentioned.split('@')[0]}\n\nMchezaji wa kwanza: @${games[gameId].players[0].split('@')[0]}\n\n*Tumia:* *.move [1-9]*\n\n${formatBoard(games[gameId].board)}`,
    mentions: [sender, mentioned],
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      externalAdReply: {
        title: 'NEXUS AI GAME',
        mediaType: 2,
        mediaUrl: conf.URL,
        sourceUrl: conf.GURL,
        thumbnailUrl: conf.LOGO
      },
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363025983927370@newsletter',
        newsletterName: "Nexus XMD",
        serverMessageId: "12"
      }
    }
  }, { quoted: ms });

  await zk.sendMessage(dest, {
    audio: { url: AUDIO_URL },
    mimetype: 'audio/mp4',
    ptt: true
  }, { quoted: ms });
});

// Move handler
zokou({
  nomCom: 'move',
  categorie: 'game'
}, async (dest, zk, { ms, arg }) => {
  const sender = ms.sender;
  const move = parseInt(arg[0]) - 1;

  const game = Object.values(games).find(g => g.players.includes(sender));
  if (!game) return zk.sendMessage(dest, {
    text: '*🚫 Hakuna game inayoendelea kwako. Anzisha kwa:* `.ticatoe @mtu`',
    contextInfo: {
      forwardingScore: 777,
      isForwarded: true,
      externalAdReply: {
        title: 'No Game Found',
        mediaUrl: conf.URL,
        sourceUrl: conf.GURL,
        thumbnailUrl: conf.LOGO
      },
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363025983927370@newsletter',
        newsletterName: "Nexus XMD",
        serverMessageId: "11"
      }
    }
  }, { quoted: ms });

  if (game.players[game.turn] !== sender)
    return zk.sendMessage(dest, { text: `⏳ *Subiri zamu yako!*` }, { quoted: ms });

  if (move < 0 || move > 8 || game.board[move])
    return zk.sendMessage(dest, { text: `❌ *Nafasi hiyo haifai. Tumia namba 1-9 na usichukue nafasi iliyochukuliwa.*` }, { quoted: ms });

  game.board[move] = game.turn === 0 ? '❌' : '⭕';

  const opponent = game.players[1 - game.turn];

  if (checkWinner(game.board, game.board[move])) {
    delete games[`${game.players[0]}:${game.players[1]}`];
    return zk.sendMessage(dest, {
      text: `🎉 *Mshindi:* @${sender.split('@')[0]}!\n\n${formatBoard(game.board)}`,
      mentions: [sender],
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: 'Winner!',
          mediaUrl: conf.URL,
          sourceUrl: conf.GURL,
          thumbnailUrl: conf.LOGO
        },
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363025983927370@newsletter',
          newsletterName: "Nexus XMD",
          serverMessageId: "14"
        }
      }
    }, { quoted: ms });
  }

  if (isDraw(game.board)) {
    delete games[`${game.players[0]}:${game.players[1]}`];
    return zk.sendMessage(dest, {
      text: `🤝 *Game Imeisha Sare!*\n\n${formatBoard(game.board)}`,
      contextInfo: {
        forwardingScore: 888,
        isForwarded: true
      }
    }, { quoted: ms });
  }

  game.turn = 1 - game.turn;

  await zk.sendMessage(dest, {
    text: `✅ *Move imewekwa!* Zamu ya @${opponent.split('@')[0]}\n\n${formatBoard(game.board)}`,
    mentions: [opponent],
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true
    }
  }, { quoted: ms });
});
