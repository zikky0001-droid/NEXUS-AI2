const { zokou } = require('../framework/zokou'); 
const {muteUser, unmuteUser, isUserMuted} = require('../bdd/mute') 
const s = require("../set")

zokou( 
  { 
    nomCom : 'mute', 
    categorie : 'Group' 
  },
  async (dest,zk,commandeOptions) => {
    const {ms , arg, repondre,superUser,verifGroupe,verifAdmin , msgRepondu , auteurMsgRepondu} = commandeOptions;
    if(!verifGroupe ) {repondre('this is a group commands') ; return};
    if(verifAdmin || superUser) {
      if(!msgRepondu){repondre('reply a message of user to mute'); return};
      await muteUser(auteurMsgRepondu)
      repondre(`@${auteurMsgRepondu.split('@')[0]} has been muted`, {mentions: [auteurMsgRepondu]})
    } else {
      repondre('you are not admin')
    }
  }
);

zokou( 
  { 
    nomCom : 'unmute', 
    categorie : 'Group' 
  },
  async (dest,zk,commandeOptions) => {
    const {ms , arg, repondre,superUser,verifGroupe,verifAdmin , msgRepondu , auteurMsgRepondu} = commandeOptions;
    if(!verifGroupe ) {repondre('this is a group commands') ; return};
    if(verifAdmin || superUser) {
      if(!msgRepondu){repondre('reply a message of user to unmute'); return};
      await unmuteUser(auteurMsgRepondu)
      repondre(`@${auteurMsgRepondu.split('@')[0]} has been unmuted`, {mentions: [auteurMsgRepondu]})
    } else {
      repondre('you are not admin')
    }
  }
);
