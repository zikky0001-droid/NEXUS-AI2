const { zokou } = require('../framework/zokou');

zokou(
    {
        nomCom: 'mute',
        categorie: 'Group',
        description: 'Lock group (only admins can send messages)'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, verifGroupe, verifAdmin, superUser } = commandeOptions;

        if (!verifGroupe) { 
            repondre('❌ This command only works in groups!'); 
            return; 
        }
        if (!verifAdmin && !superUser) { 
            repondre('❌ Only admins can lock the group!'); 
            return; 
        }

        try {
            // Set group to "admins only" mode
            await zk.groupSettingUpdate(
                dest,
                'announcement' // WhatsApp uses "announcement" for "admins only"
            );
            repondre('🔒 *Group locked!* Only admins can send messages.');
        } catch (e) {
            repondre(`❌ Failed to lock group: ${e.message}`);
        }
    }
);

zokou(
    {
        nomCom: 'unmute',
        categorie: 'Group',
        description: 'Unlock group (everyone can send messages)'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, verifGroupe, verifAdmin, superUser } = commandeOptions;

        if (!verifGroupe) { 
            repondre('❌ This command only works in groups!'); 
            return; 
        }
        if (!verifAdmin && !superUser) { 
            repondre('❌ Only admins can unlock the group!'); 
            return; 
        }

        try {
            // Set group to "everyone can send messages" mode
            await zk.groupSettingUpdate(
                dest,
                'not_announcement' // WhatsApp term for "unlocked"
            );
            repondre('🔓 *Group unlocked!* Everyone can send messages now.');
        } catch (e) {
            repondre(`❌ Failed to unlock group: ${e.message}`);
        }
    }
);
