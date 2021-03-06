import Sequelize from 'sequelize';

const sequelize = new Sequelize('slack', 'sasha', '', {
  dialect: 'postgres',
  define: {
    underscored: true,
  },
  operatorsAliases: Sequelize.Op,
});

const db = {
  User: sequelize.import('./user'),
  Channel: sequelize.import('./channel'),
  Team: sequelize.import('./team'),
  Message: sequelize.import('./message'),
  Member: sequelize.import('./member'),
};

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
