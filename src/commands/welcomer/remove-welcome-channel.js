const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const WelcomeChannel = require('../../models/WelcomeChannel');

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        try {
            const targetChannel =  interaction.options.getChannel('target-channel');
            await interaction.deferReply({ ephemeral: true });
            const query = {
                guildId: interaction.guildId,
                channelId: targetChannel.id,
            }

            const channnelExistsInDb = await WelcomeChannel.exists(query);
            if (!channnelExistsInDb) {
                interaction.followUp("This channel has not been configured for welcome messages.");
                return;
            }

            await WelcomeChannel.findOneAndDelete(query);

            interaction.followUp(`Removed ${targetChannel} frome recieving welcome messages.`);
        } catch (error) {
            console.log("Error: " + error);
        }
    },
    name: 'remove-welcome-channnel',
    description: 'Setup a channel to send welcome messages to.',
    options: [
        {
            name: 'target-channel',
            description: 'The channel to get remove welcome messages from.',
            type: ApplicationCommandOptionType.Channel,
            required: true
        },
    ]
};
