require('dotenv').config();

const { REST, Routes } = require('discord.js');

const rest = new REST({version: 10}).setToken(process.env.API_KEY);

const commands = [
    {
        name: "hey",
        description: "Welcome to Discord"
    },
    {
        name: "ping",
        description: "pong!"
    },
]

// (async () => {
//     try {
//       await rest.put(
//         Routes.applicationGuildCommands( process.env.CLIENT_ID, process.env.GUILD_ID),
//         { body: commands }
//       )
//     } catch (err) {
//       console.log(err);
//     }
// })();

rest.put(
    Routes.applicationGuildCommands( process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  )