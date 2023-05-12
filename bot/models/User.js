const Sequelize = require('sequelize');

module.exports = (sequelize) => {
	const User = sequelize.define('users', {
		userId: {
			type: Sequelize.STRING,
			unique: true,
		},
		loginId: Sequelize.STRING,
		roleId: Sequelize.STRING
	});
	return User;
}

