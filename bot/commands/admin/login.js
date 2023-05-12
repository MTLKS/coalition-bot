const { SlashCommandBuilder } = require('discord.js')
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

const User = require(`${__dirname}/../../models/User`)(sequelize);

function makeid(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('login')
		.setDescription('Login to 42 intranet.'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		let loginId = makeid(5);
		try {
			const user = await User.create({
				userId: interaction.user.id,
				loginId: loginId,
				roleId: ''
			});

			return interaction.editReply({ content: `Please go to http://mtlks.com/login/${loginId}`, ephemeral: true });
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.editReply({ content: 'You have already logged in.', ephemeral: true });
			}

			return interaction.editReply({ content: 'Something went wrong.', ephemeral: true });
		}
		
	},
}