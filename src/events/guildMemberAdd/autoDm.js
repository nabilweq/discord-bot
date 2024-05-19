const { Client, GuildMember } = require('discord.js');
const WelcomeChannel = require('../../models/WelcomeChannel')

/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member, args) => {
  try {

    const welcomeconfig = await WelcomeChannel.findOne({
        guildId: guildMember.guild.id
    });

    const customMessage = welcomeconfig?.customMessage || 'Hey {username}👋. Welcome to {server-name}!'

    const user = member.mentions.users.first() || member.guild.members.cache.get(args[0])?.user

    const welcomeMessage = customMessage
    .replace('{mention-member}', `@${member.user.tag}`)
    .replace('{username}', member.user.username)
    .replace('{server-name}', member.guild.name);

    user.send(welcomeMessage);
    
  } catch (error) {
    console.log(`Error giving role automatically: ${error}`);
  }
};
