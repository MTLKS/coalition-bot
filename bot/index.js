// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, guildId } = require('./config.json');
const { segmentationSlayers, kernelKamikazes, unixUnicorns, bugBusters } = require('./config.json');
const Sequelize = require('sequelize');
const { io } = require('socket.io-client');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Database
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});
const User = require(`${__dirname}/models/User`)(sequelize);

// Commands
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	if (interaction.guild.id !== guildId) {
		return await interaction.reply({ content: 'This bot is not set to work with this server!', ephemeral: true });
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Socket
const socket = io('ws://mtlks.com/', {
	reconnectionDelayMax: 10000
});

socket.on('addRole', async (data) => {
	console.log(data);

	let roleId = '';
	switch (data.coalition) {
		case "Segmentation Slayers":
			roleId = segmentationSlayers;
			break;
		case "Unix Unicorns":
			roleId = unixUnicorns;
			break;
		case "Kernel Kamikazes":
			roleId = kernelKamikazes;
			break;
		case "Bug Busters":
			roleId = bugBusters;
			break;
	}

	if (roleId !== '') {
		await User.update({roleId: roleId}, {
			where: {
				loginId: data.id
			}
		})
	}
})

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	User.sync({ force: true });
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);