const { zokou } = require('../framework/zokou');
const { ajouterUtilisateurAvecWarnCount, getWarnCountByJID, resetWarnCountByJID } = require('../bdd/mute');
const s = require("../set");

zokou(
    {
        nomCom: 'mute', // Changed from 'warn' to 'mute'
        categorie: 'Group'
    },
    async (dest, zk, commandeOptions) => {
        const { ms, arg, repondre, superUser, verifGroupe, verifAdmin, msgRepondu, auteurMsgRepondu } = commandeOptions;
        
        if (!verifGroupe) { repondre('This is a group command'); return; }

        if (verifAdmin || superUser) {
            if (!msgRepondu) { repondre('Reply to a message of user to mute'); return; }
            
            // Mute logic
            try {
                // Add your mute role logic here
                // Example: await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "mute");
                repondre(`User has been muted.`);
            } catch (error) {
                repondre('Error muting user: ' + error);
            }
        } else {
            repondre('You are not admin');
        }
    }
);

zokou(
    {
        nomCom: 'unmute', // New unmute command
        categorie: 'Group'
    },
    async (dest, zk, commandeOptions) => {
        const { ms, arg, repondre, superUser, verifGroupe, verifAdmin, msgRepondu, auteurMsgRepondu } = commandeOptions;
        
        if (!verifGroupe) { repondre('This is a group command'); return; }

        if (verifAdmin || superUser) {
            if (!msgRepondu) { repondre('Reply to a message of user to unmute'); return; }
            
            // Unmute logic
            try {
                // Add your unmute role logic here
                // Example: await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "unmute");
                repondre(`User has been unmuted.`);
            } catch (error) {
                repondre('Error unmuting user: ' + error);
            }
        } else {
            repondre('You are not admin');
        }
    }
);
