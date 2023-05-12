const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		console.log(interaction.member._roles);
		console.log(interaction.member._roles.some(item => ['1103896601199661057', '1103896700885667965', '1103896646984663040', '1103896671571689534'].includes(item)))
		await interaction.reply({ content: 'Pong!', ephemeral: true });	
	},
}