export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: { // { models } === context.models, comes from index, sequelize context inside
    createUser: (parent, args, { models }) => models.User.create(args),
  },
};
