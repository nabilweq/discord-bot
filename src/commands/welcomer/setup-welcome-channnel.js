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
            const targetChannel = interaction.options.getChannel('target-channel') //interaction.options.get('target-channel').value;
            const customMessage = interaction.options.get('custom-message')?.value || "Dummy message";

            await interaction.deferReply({ ephemeral: true });
            const query = {
                guildId: interaction.guildId,
                channelId: targetChannel.id,
            }

            const channnelExistsInDb = await WelcomeChannel.exists(query);
            if (channnelExistsInDb) {
                interaction.followUp("This channel has already been configured for welcome messages");
                return;
            }
            // Welcome {mention-user}! Have a greate day {username}. You joined the server {server-name}.

            const newChannel = new WelcomeChannel({
                ...query,
                customMessage: customMessage
            })

            await newChannel.save();
            interaction.followUp(`Configured ${targetChannel} to recieve welcome messages.`);
        } catch (error) {
            console.log("Error: " + error);
        }
    },
    name: 'setup-welcome-channnel',
    description: 'Setup a channel to send welcome messages to.',
    options: [
        {
            name: 'target-channel',
            description: 'The channel to get welcome messages in.',
            type: ApplicationCommandOptionType.Channel,
            required: true
        },
        {
            name: 'custom-message',
            description: 'TEMPLATES: {mention-member} {username} {server-name}',
            type: ApplicationCommandOptionType.String,
        },
    ]
};
