const { EmbedBuilder } = require("discord.js");
const statsChannels = require("../../models/ChannelStats");

const choices = [{
    name: "Number Of Roles",
    value: 0
}, {
    name: "Number Of Channels",
    value: 1
}, {
    name: "Number Of Members",
    value: 2
}];

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const option = interaction.options.getSubcommand(),
            channel = interaction.options.getChannel("channel"),
            del = interaction.options.getBoolean("delete"),
            format = interaction.options.getString("format"),
            type = interaction.options.getInteger("type");

        try {
            if (option === "remove") {
                const data = await statsChannels.findOne({ id: channel.id });
                
                if (!data) return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("❌ Invalid Channel")
                            .setColor(0xFF0000)
                            .setDescription("This channel is not a stats channel")
                    ]
                });
    
                await statsChannels.findOneAndDelete({ id: channel.id });
    
                if (del) channel.delete().catch(() => null);
    
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("✅ Channel " + (del ? "Deleted" : "Removed"))
                            .setColor(0x00FF00)
                    ]
                });
            } else if (option === "set") {
                const data = await statsChannels.findOne({ id: channel.id });
    
                if (data) return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("❌ Invalid Channel")
                            .setColor(0xFF0000)
                            .setDescription("This channel is already a stats channel")
                    ]
                });
    
                channel.setName(format.replace('{number}', type === 0 ? interaction.guild.roles.cache.size : type === 1 ? interaction.guild.channels.cache.size : interaction.guild.members.cache.size)).then(async () => {
                    await statsChannels.create({ id: channel.id, guild: interaction.guildId, format, type });
    
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("✅ Channel Setted As Stats Channel")
                                .setColor(0x00FF00)
                                .setDescription(`This channel will now show \`${choices[type].name}\`\nNaming format: \`${format}\``)
                        ]
                    });
                }).catch((err) => {
                    console.log(err);
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("❌ Command Failed")
                                .setColor(0xFF0000)
                                .setDescription(`Unable to change name of the channel`)
                        ]
                    });
                })
            }
        } catch (error) {
            console.log("Error: ",error);
        }
    },
    name: "stats",
    description: "Manage stats channels of your server",
    options: [
        {
            name: "set",
            type: 1,
            description: "Set a channel a stats channel",
            options: [{
                name: "channel",
                type: 7,
                description: "The channel you want to set as a stat channel",
                required: true,
            }, {
                name: "type",
                type: 4,
                description: "Stats type",
                required: true,
                choices
            }, {
                name: "format",
                type: 3,
                description: "Channel naming format, example: Roles {number}, Channels {number}",
                required: true,
            }]
        }, {
            name: "remove",
            type: 1,
            description: "Remove a channel from a stat channel mode",
            options: [{
                name: "channel",
                type: 7,
                description: "The channel you want remove from stat channel mode",
                required: true,
            }, {
                name: "delete",
                type: 5,
                description: "Also delete the channel from your discord",
            }]
        }
    ],
}