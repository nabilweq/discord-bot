const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        try {
            const targetUser = interaction.options.getUser('target-user');
 
            let member;
         
            if (targetUser) {
                member = interaction.guild.members.cache.get(targetUser.id) ||
                    (await interaction.guild.members.fetch(targetUser.id));
            } else {
                member = interaction.member;
            }
         
            client.emit('guildMemberAdd', member);
         
            interaction.reply('Simulated join!');
        } catch (error) {
            console.log("Error: " + error);
        }
    },
    name: 'simulate-join',
    description: 'Simulate a member joining.',
    options: [
        {
            name: 'target-user',
            description: 'The user you want to emulate joining.',
            type: ApplicationCommandOptionType.User,
            //required: true
        }
    ]
};