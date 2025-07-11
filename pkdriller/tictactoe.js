const util = require('util');
const fs = require('fs-extra');
const axios = require('axios');
const { zokou } = require(__dirname + '/../framework/zokou');
const moment = require("moment-timezone");
const os = require("os");
const conf = require(__dirname + '/../set');
moment.tz.setDefault(conf.TZ);

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/nexus.mp3";
const THUMBNAIL_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/nexus-ai.jpeg";

const games = {};

const getTimeAndDate = () => ({
  time: moment().format("HH:mm:ss"),
  date: moment().format("DD/MM/YYYY")
});

class TicTacToeGame {
  constructor(pX, pO = null) {
    this.board = Array.from({ length: 9 }, (_, i) => (i + 1).toString());
    this.playerX = pX;
    this.playerO = pO;
    this.turns = 0;
    this.winner = null;
    this.currentTurn = pX;
  }

  render() {
    return this.board.map((v) => ({
      X: "❎",
      O: "⭕",
      1: "1️⃣", 2: "2️⃣", 3: "3️⃣", 4: "4️⃣", 5: "5️⃣",
      6: "6️⃣", 7: "7️⃣", 8: "8️⃣", 9: "9️⃣"
    }[v]));
  }

  turn(isO, index) {
    if (this.board[index] === "X" || this.board[index] === "O") return false;
    this.board[index] = isO ? "O" : "X";
    this.turns++;
    this.currentTurn = isO ? this.playerX : this.playerO;
    this.checkWin();
    return true;
  }

  checkWin() {
    const winSets = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const [a, b, c] of winSets) {
      if (this.board[a] === this.board[b] &&
          this.board[b] === this.board[c]) {
        this.winner = this.board[a] === "X" ? this.playerX : this.playerO;
        break;
      }
    }
  }
}

// .tictactoe command
zokou({ nomCom: "tictactoe", aliases: ["ttt"], categorie: "Games" }, async (dest, zk, commandeOptions) => {
  const { ms, sender } = commandeOptions;

  const existing = Object.values(games).find(
    (room) => [room.game.playerX, room.game.playerO].includes(sender)
  );

  if (existing) {
    return zk.sendMessage(dest, {
      text: "❌ You're already in a game. Type *surrender* to quit.",
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363288304618280@newsletter',
          newsletterName: 'NEXUS-AI',
          serverMessageId: 143
        },
        externalAdReply: {
          title: "TicTacToe Conflict",
          body: "Surrender to start a new game.",
          thumbnailUrl: THUMBNAIL_URL,
          sourceUrl: conf.GURL,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: ms });
  }

  const waiting = Object.values(games).find((g) => g.state === "WAITING");

  if (waiting) {
    waiting.game.playerO = sender;
    waiting.state = "PLAYING";
    const game = waiting.game;
    const board = game.render();

    const message = `
🎮 *TicTacToe Game Started!*
❎ @${game.playerX.split("@")[0]} vs ⭕ @${game.playerO.split("@")[0]}
🎯 Turn: @${game.currentTurn.split("@")[0]}

${board.slice(0, 3).join("")}
${board.slice(3, 6).join("")}
${board.slice(6).join("")}

Type 1-9 to play. Type *surrender* to quit.
    `.trim();

    await zk.sendMessage(dest, {
      text: message,
      mentions: [game.playerX, game.playerO],
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363288304618280@newsletter',
          newsletterName: 'NEXUS-AI',
          serverMessageId: 143
        },
        externalAdReply: {
          title: "TicTacToe Game",
          body: "Let the game begin!",
          thumbnailUrl: THUMBNAIL_URL,
          sourceUrl: conf.GURL,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: ms });

    await zk.sendMessage(dest, {
      audio: { url: AUDIO_URL },
      mimetype: "audio/mp4",
      ptt: true
    }, { quoted: ms });

  } else {
    const id = "ttt-" + Date.now();
    games[id] = {
      id,
      game: new TicTacToeGame(sender),
      state: "WAITING"
    };
    await zk.sendMessage(dest, {
      text: "⏳ Waiting for opponent. Ask someone to type *.tictactoe* to join."
    }, { quoted: ms });
  }
});

// message handler to play
zokou({ nomCom: "any", categorie: "Games" }, async (dest, zk, commandeOptions) => {
  const { ms, sender, body } = commandeOptions;
  const isMove = /^[1-9]$/.test(body.trim());
  const isSurrender = /^(surrender|give up)$/i.test(body.trim());

  const room = Object.values(games).find(
    (g) => g.state === "PLAYING" && [g.game.playerX, g.game.playerO].includes(sender)
  );

  if (!room) return;
  const game = room.game;

  if (isSurrender) {
    const opponent = sender === game.playerX ? game.playerO : game.playerX;
    delete games[room.id];
    return zk.sendMessage(dest, {
      text: `🏳️ @${sender.split('@')[0]} surrendered! @${opponent.split('@')[0]} wins!`,
      mentions: [sender, opponent]
    }, { quoted: ms });
  }

  if (!isMove) return;
  if (sender !== game.currentTurn) {
    return zk.sendMessage(dest, { text: "❌ Not your turn!" }, { quoted: ms });
  }

  const move = parseInt(body.trim()) - 1;
  const success = game.turn(sender === game.playerO, move);
  if (!success) {
    return zk.sendMessage(dest, { text: "⚠️ Invalid move!" }, { quoted: ms });
  }

  const board = game.render();
  let message = `
🎮 *TicTacToe Game*
${board.slice(0, 3).join("")}
${board.slice(3, 6).join("")}
${board.slice(6).join("")}
  `.trim();

  if (game.winner) {
    message += `\n\n🎉 @${game.winner.split("@")[0]} wins the game!`;
    delete games[room.id];
  } else if (game.turns >= 9) {
    message += "\n\n🤝 It's a draw!";
    delete games[room.id];
  } else {
    message += `\n\n🎯 Turn: @${game.currentTurn.split("@")[0]}`;
  }

  await zk.sendMessage(dest, {
    text: message,
    mentions: [game.playerX, game.playerO],
  }, { quoted: ms });
});
          
