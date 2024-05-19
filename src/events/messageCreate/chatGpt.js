const { Client, Message } = require('discord.js');
const OpenAI = require('openai');

const configuration = {
    apiKey: process.env.OPENA_AI_KEY,
  };
  
const openai = new OpenAI(configuration);

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.channel.id !== process.env.CHANNEL_ID) return;
    if (message.content.startsWith('!')) return;

    let conversationLog = [
        { role: 'system', content: 'You are a friendly chatbot.' },
    ];

    try {
        await message.channel.sendTyping();
        let prevMessages = await message.channel.messages.fetch({ limit: 15 });
        prevMessages.reverse();
        
        prevMessages.forEach((msg) => {
        if (msg.content.startsWith('!')) return;
        if (msg.author.id !== client.user.id && message.author.bot) return;
        if (msg.author.id == client.user.id) {
            conversationLog.push({
            role: 'assistant',
            content: msg.content,
            name: msg.author.username
                .replace(/\s+/g, '_')
                .replace(/[^\w\s]/gi, ''),
            });
        }

        if (msg.author.id == message.author.id) {
            conversationLog.push({
            role: 'user',
            content: msg.content,
            name: message.author.username
                .replace(/\s+/g, '_')
                .replace(/[^\w\s]/gi, ''),
            });
        }
        });

        const result = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: conversationLog,
            // max_tokens: 256, // limit token usage
        })
        .catch((error) => {
            console.log(`OPENAI ERR: ${error}`);
        });

        message.reply(result.data.choices[0].message);
    } catch (error) {
        console.log(`ERR: ${error}`);
    }
};
