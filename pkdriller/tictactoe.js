const util = require('util');
const fs = require('fs-extra');
const { zokou } = require("../framework/zokou");
const moment = require('moment-timezone');
const conf = require(__dirname + '/../set');
moment.tz.setDefault(conf.TZ);

const AUDIO_URL = 'https://github.com/PKDRILLER/files/raw/main/game.mp3';

function getTimeAndDate() {
  return {
    time: moment().format("HH:mm:ss"),
    date: moment().format("YYYY-MM-DD")
  };
}

const sessions = {}; // Store active games

function renderBoard(board) {
  return board.map((v, i) => v || (i + 1)).join('').replace(/(.{3})/g, '$1\n');
}

function checkWinner(board) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let combo of wins) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return board.includes(null) ? null : 'draw';
}

zokou({
  nomCom: "ticatoe",
  categorie: "🎮 Games"
}, async (dest, zk, commandeOptions) => {
  const { ms, arg, sender } = commandeOptions;
  const { date, time } = getTimeAndDate();

  const chat = dest;
  const input = arg[0];

  if (!input) {
    return zk.sendMessage(chat, {
      text: "🎮 Usage:\n.ticatoe @user – start game\n.ticatoe move <1-9> – play turn",
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "Tic Tac Toe Game",
          body: `Fun for 2 players • ${date} | ${time}`,
          thumbnailUrl: 'https://telegra.ph/file/abcd1234.jpg',
          sourceUrl: 'https://github.com/PKDRILLER',
          renderLargerThumbnail: true,
          mediaType: 1
        }
      }
    }, { quoted: ms });
  }

  if (input === "move") {
    const move = parseInt(arg[1]) - 1;
    const session = sessions[chat];

    if (!session) return zk.sendMessage(chat, { text: "❌ No active game found." }, { quoted: ms });
    if (![session.p1, session.p2].includes(sender)) return zk.sendMessage(chat, { text: "❌ You are not a player in this match." }, { quoted: ms });
    if (sender !== session.turn) return zk.sendMessage(chat, { text: "⏳ Wait your turn!" }, { quoted: ms });
    if (isNaN(move) || move < 0 || move > 8 || session.board[move]) {
      return zk.sendMessage(chat, { text: "🚫 Invalid move. Choose a number from 1 to 9 on empty space." }, { quoted: ms });
    }

    session.board[move] = sender === session.p1 ? '❌' : '⭕';
    const winner = checkWinner(session.board);

    if (winner === '❌' || winner === '⭕') {
      const winUser = winner === '❌' ? session.p1 : session.p2;
      zk.sendMessage(chat, {
        text: `🎉 Game Over!\nWinner: @${winUser.split("@")[0]}\n\n${renderBoard(session.board)}`,
        mentions: [winUser],
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: "Winner!",
            body: `${date} | ${time}`,
            thumbnailUrl: 'https://telegra.ph/file/abcd1234.jpg',
            sourceUrl: 'https://github.com/PKDRILLER',
            renderLargerThumbnail: true,
            mediaType: 1
          }
        }
      }, { quoted: ms });
      delete sessions[chat];
    } else if (winner === 'draw') {
      zk.sendMessage(chat, {
        text: `🤝 It's a draw!\n\n${renderBoard(session.board)}`,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: "Game Drawn",
            body: `${date} | ${time}`,
            thumbnailUrl: 'https://telegra.ph/file/abcd1234.jpg',
            sourceUrl: 'https://github.com/PKDRILLER',
            renderLargerThumbnail: true,
            mediaType: 1
          }
        }
      }, { quoted: ms });
      delete sessions[chat];
    } else {
      session.turn = session.turn === session.p1 ? session.p2 : session.p1;
      zk.sendMessage(chat, {
        text: `🎮 Move played!\n${renderBoard(session.board)}\n\n🔄 Turn: @${session.turn.split("@")[0]}`,
        mentions: [session.turn],
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: "Next Turn",
            body: `${date} | ${time}`,
            thumbnailUrl: 'https://telegra.ph/file/abcd1234.jpg',
            sourceUrl: 'https://github.com/PKDRILLER',
            renderLargerThumbnail: true,
            mediaType: 1
          }
        }
      }, { quoted: ms });
    }

    return;
  }

  // Game start
  const mentioned = ms.mentionedJid?.[0];
  if (!mentioned || mentioned === sender) {
    return zk.sendMessage(chat, { text: "👥 Mention an opponent to start:\n.ticatoe @user" }, { quoted: ms });
  }

  sessions[chat] = {
    p1: sender,
    p2: mentioned,
    turn: sender,
    board: Array(9).fill(null)
  };

  zk.sendMessage(chat, {
    text: `🎮 TicTacToe started between:\n@${sender.split("@")[0]} vs @${mentioned.split("@")[0]}\n\n❌ goes first\n\n${renderBoard(Array(9).fill(null))}\n\nSend:\n.ticatoe move <1-9>`,
    mentions: [sender, mentioned],
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      externalAdReply: {
        title: "TicTacToe Match",
        body: `${date} | ${time}`,
        thumbnailUrl: 'https://telegra.ph/file/abcd1234.jpg',
        sourceUrl: 'https://github.com/PKDRILLER',
        renderLargerThumbnail: true,
        mediaType: 1
      }
    }
  }, { quoted: ms });

  zk.sendMessage(chat, {
    audio: { url: AUDIO_URL },
    mimetype: 'audio/mp4',
    ptt: true
  }, { quoted: ms });
});
