const { Client, Interaction, ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        const args = interaction.options.getString('suggestion');
        if (!args) return interaction.reply({ content: 'Please provide a suggestion.', ephemeral: true });

        const suggestionChannel = client.channels.cache.find(channel => channel.name === 'suggestions');
        if (!suggestionChannel) return interaction.reply({ content: 'Cannot find suggestions channel.', ephemeral: true });

        await suggestionChannel.send(`New suggestion from ${interaction.user}:\n${args}`);
        interaction.reply({ content: 'Your suggestion has been submitted!', ephemeral: true });
    },
    name: 'suggestion',
    description: 'Submit a suggestion',
};
