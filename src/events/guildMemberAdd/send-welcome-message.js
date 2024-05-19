const WelcomeChannel = require('../../models/WelcomeChannel')

/**
 * 
 * @param {import('discord.js').GuildMember} guildMember 
 */
module.exports = async(client, guildMember) => {
    try {
        if(guildMember.user.bot) return;

        const welcomeconfigs = await WelcomeChannel.find({
            guildId: guildMember.guild.id
        });

        if(!welcomeconfigs.length) return;

        for(const welcomeconfig of welcomeconfigs) {
            const targetChannel = guildMember.guild.channels.cache.get(
                welcomeconfig.channelId
            ) || (await guildMember.guild.channels.fetch(welcomeconfig.channelId))

            if(!targetChannel) {
                await WelcomeChannel.findOneAndDelete({
                    guildId: guildMember.guild.id,
                    channelId: welcomeconfig.channelId
                });
            }

            const customMessage = welcomeconfig?.customMessage || 'Hey {username}👋. Welcome to {server-name}!'

            const welcomeMessage = customMessage
            .replace('{mention-member}', `@${guildMember.user.tag}`)
            .replace('{username}', guildMember.user.username)
            .replace('{server-name}', guildMember.guild.name);

            targetChannel.send(welcomeMessage);
        }

    } catch (err) {
        console.log("Error: ", err);
    }
};