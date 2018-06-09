import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: 'The username can only contain letters and numbers',
        },
        len: {
          args: [3, 20],
          msg: 'The username needs to be between 3 and 25 characters long',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'Invalid email',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [5, 20],
          msg: 'The password should be between 5 and 20 characers long',
        },
      },
    },
  }, {
    hooks: {
      afterValidate: async (user) => {
        const hashedPass = await bcrypt.hash(user.password, 12);
        // eslint-disable-next-line no-param-reassign
        user.password = hashedPass;
      },
    },
  });

  User.associate = (models) => {
    User.belongsToMany(models.Team, {
      through: 'member',
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });

    // N to N
    User.belongsToMany(models.Channel, {
      through: 'channel_member',
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });
  };

  return User;
};
