const { Client, Interaction, ApplicationCommandOptionType, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const Ticket = require('../../models/Ticket');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @returns 
     */
    callback: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand();

        const data = await Ticket.findOne({ guild: interaction.guild.id });

        switch (subcommand) {
            case 'send':
                if (!data) return interaction.reply({ content: '⚠️ You have to set up the ticket system first with `/ticket setup`.', ephemeral: true });

                const name = interaction.options.getString('name');
                const message = interaction.options.getString('message') || 'Create a ticket to chat with the server staff! Once you select below, use the input to describe why you are creating this ticket';

                const select = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                    .setCustomId('ticketCreateSelect')
                    .setPlaceholder(`🌎 ${name}`)
                    .setMinValues(1)
                    .addOptions(
                        {
                            label: 'Create your ticket',
                            description: 'click to begin the ticker creation process',
                            value: 'createTicket'
                        }
                    )
                )

                const embed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle('🔰 Create a ticket')
                .setDescription(message+' 🎫')
                .setFooter({text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}`})

                await interaction.reply({ content: '🌎 I have sent your ticket message below.', embeds: [embed], components: [select] });
                break;

            case 'remove':
                if (!data) return interaction.reply({ content: '⚠️ Looks like you don\'t already have a ticket system set', ephemeral: true });

                await Ticket.deleteOne({ guild: interaction.guild.id });
                await interaction.reply({ content: '🌎 I have deleted your ticket category', ephemeral: true });
                break;

            case 'setup':
                if (data) return interaction.reply({ content: `⚠️ Looks like you already have a ticket category set to <#${data.category}>`, ephemeral: true });

                const category = interaction.options.getChannel('category');
                await Ticket.create({
                    guild: interaction.guild.id,
                    category: category?.id
                });

                await interaction.reply({ content: `🌎 I have set the category to **${category}**! Use \`/ticket send\` to send a ticket create message`, ephemeral: true });
                break;

            default:
                interaction.reply({ content: '⚠️ Invalid subcommand. Use `send`, `remove`, or `setup`', ephemeral: true });
        }
    },
    name: 'ticket',
    description: 'Manage the ticket system',
    options: [
        {
          name: 'send',
          description: 'Send the ticket message',
          options: [
            {
                name: 'name',
                description: 'The name for the open select menu content',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'message',
                description: 'A custom message to add to the embed',
                type: ApplicationCommandOptionType.String,
                required: false
            }
          ],
          type: 1,
        },
        {
            name: 'setup',
            description: 'Setup the ticket category',
            options: [
              {
                name: 'category',
                description: 'The category to send tickets in',
                type: ApplicationCommandOptionType.Channel,
                //type: 'CHANNEL',
                required: true,
                channel_types: [ChannelType.GuildCategory],
                //channelTypes: 
              },
              {
                name: 'message',
                description: 'A custom message to add to the embed',
                type: ApplicationCommandOptionType.String,
                required: false
              }
            ],
            type: 1,
        },
        {
            name: 'remove',
            description: 'Disable the ticket system',
            type: 1,
        }
      ],
};

// const { SlashCommandBuilder, ChannelType, PermissionsBitField, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

// const Ticket = require('../../models/Ticket');

// module.exports = {
//     data: new SlashCommandBuilder()
//     .setName('ticket')
//     .setDescription('Manage the ticket system')
//     .addSubcommand( command => command.setName('send').setDescription('Send the ticket message').addStringOption( option => option.setName('name').setDescription('The name for the open select menu content').setRequired(true) ).addStringOption(option => option.setName('message').setDescription('A custom message to add to the embed').setRequired(false) ) )
//     .addSubcommand( command => command.setName('setup').setDescription('Setup the ticket category').addChannelOption( option => option.setName('category').setDescription('The category to send tickets in').addChannelTypes(ChannelType.GuildCategory).setRequired(true)))
//     .addSubcommand( command => command.setName('remove').setDescription('Disable the ticket system') )
//     .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
//     async execute (interaction) {

//         const { options } = interaction;
//         const sub = options.addSubcommand();
//         const data = await Ticket.findOne({ guild: interaction.guild.id });

//         switch (sub) {
//             case 'send':
//                 if(!data) return await interaction.reply({content: `⚠️ You have to do /ticket setup before you can send a text message...`, ephemeral: true});

//                 const name = options.getString('name');
//                 let message = options.getString('message') || `Create a ticket to chat with the server staff ! once you select below, use the input to describe why you are creating this ticket`;

//                 const select = new ActionRowBuilder()
//                 .addComponents(
//                     new StringSelectMenuBuilder()
//                     .setCustomId('ticketCreateSelect')
//                     .setPlaceholder(`🌎 ${name}`)
//                     .setMinValues(1)
//                     .addOptions(
//                         {
//                             label: 'Create your ticket',
//                             description: 'click to begin the ticker creation process',
//                             value: 'createTicket'
//                         }
//                     )
//                 )

//                 const embed = new EmbedBuilder()
//                 .setColor('Blurple')
//                 .setTitle('🔰 Create a ticket')
//                 .setDescription(message+' 🎫')
//                 .setFooter({text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}`})

//                 await interaction.reply({content: `🌎 I have sent your ticket message below.`, ephemeral: true});
//                 await interaction.channel.send({embeds: [embed], components: [select]});
//             break;
//             case 'remove':
//                 if(!data) return await interaction.reply({content: `⚠️ Looks like you don't already have a ticket system set`, ephemeral: true});

//                 await Ticket.deleteOne({guild: interaction.guild.id});
//                 await interaction.reply({content: '🌎 I have deleted your ticket category', ephemeral:true});

//             break;

//             case 'setup':
//                 if(data) return await interaction.reply({content: `⚠️ Looks like you already have a ticket categroy set to <#${data.category}>`, ephemeral: true});

//                 const category = options.getChannel('category');
//                 await Ticket.create({
//                     guild: interaction.guild.id,
//                     category: category?.id
//                 });

//                 await interaction.reply({ content: `🌎 I have set the category to **${category}**! Use /ticket send to send a ticket create message`, ephemeral: true })
//         }
//     }
// }