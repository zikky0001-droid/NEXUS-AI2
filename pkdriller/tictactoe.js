const { zokou } = require("../framework/zokou");
const conf = require("../set");
const moment = require("moment-timezone");
moment.tz.setDefault(conf.TZ);

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/nexus.mp3";

const waitingAccept = new Map();
const ongoingGames = new Map(); // chatId → game object

const EMOJIS = {
  empty: "⬜",
  X: "❌",
  O: "⭕"
};

function renderBoard(board) {
  return board.map(row => row.map(cell => cell || EMOJIS.empty).join("")).join("\n");
}

function checkWinner(board, symbol) {
  const flat = board.flat();
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diags
  ];
  return lines.some(line => line.every(i => flat[i] === symbol));
}

function isDraw(board) {
  return board.flat().every(cell => cell);
}

// Zokou Command
zokou({
  nomCom: "tictactoe",
  categorie: "Games"
}, async (dest, zk, { ms, mentionByTag }) => {
  const sender = ms.sender;
  const opponent = mentionByTag[0];

  if (!opponent) return zk.sendMessage(dest, {
    text: "*TicTacToe 🧠*\n\n❗Tag rafiki wako: `.tictactoe @user`",
    contextInfo: getContext()
  }, { quoted: ms });

  if (ongoingGames.has(dest)) {
    return zk.sendMessage(dest, {
      text: "❌ Kuna game inayoendelea kwa sasa kwenye chat hii. Subiri iishe kwanza.",
      contextInfo: getContext()
    }, { quoted: ms });
  }

  waitingAccept.set(dest, { starter: sender, opponent });

  await zk.sendMessage(dest, {
    text: `🎮 @${sender.split('@')[0]} amekualika kucheza *TicTacToe Emoji Edition*\n\n💬 *Jibu na:* yes`,
    mentions: [sender, opponent],
    contextInfo: getContext()
  }, { quoted: ms });
});

// Global listener kwa "yes"
const { globalClient } = require('../framework/baileysHandler'); // your client instance here

globalClient.ev.on("messages.upsert", async ({ messages }) => {
  const msg = messages[0];
  if (!msg.message) return;

  const chatId = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;
  const content = msg.message.conversation || msg.message.extendedTextMessage?.text;

  if (waitingAccept.has(chatId)) {
    const { starter, opponent } = waitingAccept.get(chatId);

    if (sender === opponent && content?.toLowerCase().trim() === "yes") {
      // Accept challenge
      const board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ];
      ongoingGames.set(chatId, {
        players: [starter, opponent],
        board,
        turn: 0
      });

      waitingAccept.delete(chatId);

      const playerTag = ongoingGames.get(chatId).players[0].split("@")[0];
      await globalClient.sendMessage(chatId, {
        text: `✅ Challenge accepted! Game imeanza\n\n${renderBoard(board)}\n\n🎯 Zamu ya: @${playerTag}\n\n⚠️ *Jibu namba [1-9]* kuchagua nafasi.`,
        mentions: ongoingGames.get(chatId).players,
        contextInfo: getContext()
      });
    }
  }

  // Gameplay
  if (ongoingGames.has(chatId)) {
    const game = ongoingGames.get(chatId);
    const player = game.players[game.turn];
    if (sender !== player) return;

    const input = content?.trim();
    const pos = parseInt(input);
    if (!pos || pos < 1 || pos > 9) return;

    const row = Math.floor((pos - 1) / 3);
    const col = (pos - 1) % 3;

    if (game.board[row][col]) {
      await globalClient.sendMessage(chatId, {
        text: `❌ Nafasi hiyo tayari imechukuliwa!`,
        contextInfo: getContext()
      });
      return;
    }

    const symbol = game.turn === 0 ? EMOJIS.X : EMOJIS.O;
    game.board[row][col] = symbol;

    if (checkWinner(game.board, symbol)) {
      await globalClient.sendMessage(chatId, {
        text: `🏆 @${sender.split("@")[0]} ameshinda!\n\n${renderBoard(game.board)}`,
        mentions: game.players,
        contextInfo: getContext()
      });
      ongoingGames.delete(chatId);
      return;
    }

    if (isDraw(game.board)) {
      await globalClient.sendMessage(chatId, {
        text: `🤝 Game imeisha SARE!\n\n${renderBoard(game.board)}`,
        contextInfo: getContext()
      });
      ongoingGames.delete(chatId);
      return;
    }

    // Next turn
    game.turn = 1 - game.turn;
    const nextPlayer = game.players[game.turn];
    await globalClient.sendMessage(chatId, {
      text: `✅ @${sender.split("@")[0]} amecheza.\n\n${renderBoard(game.board)}\n\n🎯 Zamu ya: @${nextPlayer.split("@")[0]}`,
      mentions: game.players,
      contextInfo: getContext()
    });
  }
});

// Helper
function getContext() {
  return {
    forwardingScore: 999,
    isForwarded: true,
    externalAdReply: {
      title: "TicTacToe Emoji",
      mediaUrl: conf.URL,
      sourceUrl: conf.GURL,
      thumbnailUrl: conf.LOGO
    },
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363025983927370@newsletter",
      newsletterName: "Nexus XMD",
      serverMessageId: "15"
    }
  };
        }
    
