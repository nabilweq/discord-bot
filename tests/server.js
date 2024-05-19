require('dotenv').config();

const { Client, GatewayIntentBits } =  require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
] });

client.on('ready', () => {
  console.log(`🔰🔰Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", msg => {
  if(msg.author.bot) return;
  if(msg.content == 'ping') {
      msg.reply("pong");
  }
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'hey') {
    await interaction.reply('Hey!');
  }

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
    if (!channel) return;
    channel.send(`Hi ${member}, Welcome to the nabeel's server`, {
        files: [{
          attachment: '/files/test.jpeg',
          name: 'test.jpeg'
        }]
    })
});

client.login(process.env.API_KEY);