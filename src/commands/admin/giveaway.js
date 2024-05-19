const { Client, Interaction } = require('discord.js');
const { default: ms } = require('ms-prettify')

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        interaction.deferReply()
        const option = interaction.options.getSubcommand(),
            channel = interaction.options.getChannel("channel"),
            prize = interaction.options.getString("prize"),
            image = interaction.options.getString("image"),
            giveawayId = interaction.options.getString("giveaway-id"),
            duration = ms(interaction.options.getString("duration") || ""),
            winnerCount = interaction.options.getInteger("winner-count");

        if (option === "start") {
            if (!duration) return interaction.editReply({
                embeds: [{
                    color: 0xFF0000,
                    title: "❌ Invalid Time",
                    description: "Please provide valid time, like: `10 days` or `15 minutes 20 second` etc"
                }]
            });

            await client.giveawaysManager.start(channel, {
                prize,
                winnerCount,
                duration,
                hostedBy: interaction.user,
                image,
            });

            interaction.editReply({
                embeds: [{
                    color: 0x00FF00,
                    title: "✅ Giveaway Started",
                    description: `Check out in ${channel.toString()}`
                }]
            })
        } else if (option === "end") {
            const gw = client.giveawaysManager.giveaways.filter(v => v.guildId === interaction.guild.id && v.messageId === giveawayId)[0];

            if (!gw) return interaction.editReply({
                embeds: [{
                    color: 0xFF0000,
                    title: "❌ Invalid Giveaway ID",
                }]
            })

            client.giveawaysManager.end(giveawayId, {
                embed: {
                    color: 0x00FF00,
                    title: "❌ Giveaway Ending Failed",
                }
            }).then(v => {
                interaction.editReply({
                    embeds: [{
                        color: 0x00FF00,
                        title: "✅ Giveaway Ended Successfully",
                    }]
                });
            }).catch(v => {
                if (!v) return;
                interaction.editReply({
                    embeds: [{
                        color: 0xFF0000,
                        title: "❌ Giveaway Ending Failed",
                        description: v.replace(/\d+/, c => `\`${c}\``)
                    }]
                });
            });
        } else if (option === "reroll") {
            const gw = client.giveawaysManager.giveaways.filter(v => v.guildId === interaction.guild.id && v.messageId === giveawayId)[0];

            if (!gw) return interaction.editReply({
                embeds: [{
                    color: 0xFF0000,
                    title: "❌ Invalid Giveaway ID",
                }]
            })

            client.giveawaysManager.reroll(giveawayId, {
                winnerCount,
                messages: {
                    congrat: {
                        embed: {
                            color: 0x00FF00,
                            title: "✅ Giveaway Rerolled Successfully",
                        }
                    },
                    error: {
                        embed: {
                            color: 0xFF0000,
                            title: "✅ Unable To Reroll Giveaway",
                        }
                    },
                    replyWhenNoWinner: {
                        embed: {
                            color: 0xFF0000,
                            title: "❌ Unable To Reroll Giveaway",
                            description: "No valid participations, no new winner(s) can be chosen!"
                        }
                    }
                }
            })
        }
    },
    name: "giveaway",
    description: "Manage giveaways of your server",
    options: [
        {
            name: "start",
            type: 1,
            description: "Start a giveaway",
            options: [{
                name: "channel",
                type: 7,
                description: "The channel where you want to start the giveaway",
                required: true,
                channel_types: [0]
            }, {
                name: "prize",
                type: 3,
                description: "The prize of this giveaway",
                required: true,
            }, {
                name: "duration",
                type: 3,
                description: "The duration of this giveaway, example: 10 days or 15minutes 10 second",
                required: true,
            }, {
                name: "winner-count",
                type: 4,
                minValue: 1,
                description: "Number of winners for this giveaway",
                required: true,
            }, {
                name: "image",
                type: 3,
                description: "The image for this giveaway embed",
            }]
        }, 
        {
            name: "end",
            type: 1,
            description: "End a giveaway",
            options: [{
                name: "giveaway-id",
                type: 3,
                description: "The giveaway id (message id of the giveaway)",
                required: true,
            }]
        }, {
            name: "reroll",
            type: 1,
            description: "Reroll a giveaway",
            options: [{
                name: "giveaway-id",
                type: 3,
                description: "The giveaway id (message id of the giveaway)",
                required: true,
            }, {
                name: "winner-count",
                type: 4,
                minValue: 1,
                description: "Number of winners for this giveaway",
                required: true,
            }]
        }
    ]
}