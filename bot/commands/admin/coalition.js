const { SlashCommandBuilder } = require('discord.js')
const Sequelize = require('sequelize');
const { segmentationSlayers, kernelKamikazes, unixUnicorns, bugBusters } = require('../../config.json');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});
const User = require(`${__dirname}/../../models/User`)(sequelize);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coalition')
		.setDescription('Give coalition role!'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		if (interaction.member._roles.some(item => [segmentationSlayers, kernelKamikazes, unixUnicorns, bugBusters].includes(item))) {
			return interaction.editReply({ content: 'It seems you already have a coalition role.'});
		}

		try {
			let user = await User.findOne({
				where: {
					userId: interaction.user.id
				}
			})
			
			if (user === null) {
				return interaction.editReply({ content: 'It seems you have not logged in yet.', ephemeral: true });
			}

			if (user.dataValues.roleId !== '') {
				let member = await interaction.guild.members.fetch(user.dataValues.userId);
				let role = await interaction.guild.roles.fetch(user.dataValues.roleId);
				console.log(member);
				console.log(role);
				await interaction.guild.members.addRole({ user: member, role: role });

				await User.destroy({
					where: {
						userId: interaction.user.id
					}
				});

				return interaction.editReply({ content: `Added ${role.name}!`, ephemeral: true });
			}
			else {
				return interaction.editReply({ content: 'It seems that you don\'t have a coalition. Have you logged in yet?', ephemeral: true });
			}
		} catch (error) {
			console.log(error);
			if (error.name === 'SequelizeDatabaseError') {
				return interaction.editReply({ content: 'It seems you have not logged in yet.', ephemeral: true });
			}
		}
	}
}