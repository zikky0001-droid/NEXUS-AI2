const db = require('./db'); // assuming you have a db module

async function muteUser(userJid) {
  // logic to mute user
  await db.set(`mute:${userJid}`, true);
}

async function unmuteUser(userJid) {
  // logic to unmute user
  await db.del(`mute:${userJid}`);
}

async function isUserMuted(userJid) {
  // logic to check if user is muted
  return await db.get(`mute:${userJid}`);
}

module.exports = { muteUser, unmuteUser, isUserMuted };
