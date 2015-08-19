var bcrypt = require('bcrypt');

module.exports = function(sequelize, Datatypes) {
	var User = sequelize.define('user', {
		id: {
			type: Datatypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: Datatypes.STRING,
			allowNull: false
		},
		username: {
			type: Datatypes.STRING,
			unique: true
		},
		password: {
			type: Datatypes.STRING,
			allowNull: false
		},
		email: {
			type: Datatypes.STRING,
			allowNull: false
		},
		profileImage: {
			type: Datatypes.STRING,
			allowNull: false
		}
	}, {
		freezeTableName: true,
		hooks: {
			beforeCreate: function(user, op, fn) {
				bcrypt.hash(user.password, 10, function(err, hash) {
					if(err) throw err;
					user.password = hash;
					fn(null, user);
				})
			}
		}
	});

	User.sync();
	return User;
}
