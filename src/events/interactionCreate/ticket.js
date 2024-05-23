const { ModalBuilder, Interaction, Client, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType, 
    PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');

const Ticket = require('../../models/Ticket');

module.exports = async (client, interaction ) => {
    try {

        if(interaction.customId == 'ticketCreateSelect') {
            const modal = new ModalBuilder()
            .setTitle(`Create your ticket`)
            .setCustomId(`ticketModal`)

            const why = new TextInputBuilder()
            .setCustomId(`whyTicket`)
            .setRequired(true)
            .setPlaceholder(`What is the reason for cretaing this ticket`)
            .setLabel(`Why are you creating this ticket`)
            .setStyle(TextInputStyle.Paragraph);

            const info = new TextInputBuilder()
            .setCustomId(`infoTicket`)
            .setRequired(false)
            .setPlaceholder('Feel free to leave this blank')
            .setLabel('Provide us with any additional information')
            .setStyle(TextInputStyle.Paragraph);

            const one = new ActionRowBuilder().addComponents(why);
            const two = new ActionRowBuilder().addComponents(info);

            modal.addComponents(one, two);
            await interaction.showModal(modal);
        } else if(interaction.customId == 'ticketModal') {
            const user = interaction.user;
            const data = await Ticket.findOne({guild: interaction.guild.id});

            if(!data) return await interaction.reply({content: `Sorry you found this message but the ticket system is not yet setup here.`, ephemeral: true});
            else {
                const why = interaction.fields.getTextInputValue('whyTicket');
                const info = interaction.fields.getTextInputValue('infoTicket');
                const category = await interaction.guild.channels.cache.get(data.category);

                const channel = await interaction.guild.channels.create({
                    name: `ticket-${user.id}`,
                    type: ChannelType.GuildText,
                    topic: `Ticket user: ${user.username}; Ticket reason: ${why}`,
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel]
                        },
                        {
                            id: interaction.guild.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
                        }
                    ]
                });

                const embed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle(`Ticket from ${ user.username} 🎫`)
                .setDescription(`Opening reason: ${why}\n\nExtra Information: ${info}`)
                .setTimestamp();

                const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('closeTicket')
                    .setLabel(`🔐 Close Ticket`)
                    .setStyle(ButtonStyle.Danger),

                    new ButtonBuilder()
                    .setCustomId('ticketTranscript')
                    .setLabel(`📃 Transcript`)
                    .setStyle(ButtonStyle.Primary)
                ); 

                await channel.send({embeds: [embed], components: [button]});
                await interaction.reply({content: `✨ Your Ticket has been opened in ${channel}`, ephemeral: true});
            }
        } else if(interaction.customId == 'closeTicket') {
            const closeModal = new ModalBuilder()
            .setTitle(`Ticket Closing`)
            .setCustomId(`closeTicketModal`);

            const reason = new TextInputBuilder()
            .setCustomId(`closeReasonTicket`)
            .setRequired(true)
            .setPlaceholder('What is the reason for closing the ticket')
            .setLabel('Provide a closign reason')
            .setStyle(TextInputStyle.Paragraph);

            const one = new ActionRowBuilder().addComponents(reason)

            closeModal.addComponents(one);
            await interaction.showModal(closeModal);
        } else if(interaction.customId == 'closeTicketModal') {
            const channel = interaction.channel;
            let name = channel.name;
            name = name.replace('ticket-', '');
            const member = await interaction.guild.members.cache.get(name);

            const reason = interaction.fields.getTextInputValue('closeReasonTicket');
            await interaction.reply({content: `🔐 Closing this ticket...`});

            setTimeout(async () => {
                await channel.delete().catch(err => {});
                await member.send(`🔔 You are recieving this notification because your ticket in ${interaction.guild.name} has been closed for : \`${reason}\``).catch(err => {});
            }, 5000)
        } else if(interaction.customId == 'ticketTranscript') {
            const file = await createTranscript(interaction.channel, {
                limit: -1,
                returnBuffer: false,
                filename: `${interaction.channel.name}.html`
            });

            const msg = await interaction.channel.send({content: `🌎 Your transcript cache:`, files: [file] });
            const message = `📃 **Here is your [ticket transcript](https://mahto.id/chat-exporter?url=${msg.attachments.first()?.url}) from ${interaction.guild.name}!**`;

            await msg.delete().catch(err => {});
            await interaction.reply({content: message, ephemeral: true});
        }
    } catch (error) {
        console.log("Error: ",error);   
    }
}