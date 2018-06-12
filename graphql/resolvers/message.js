import requiresAuth from '../../permissions';

export default {
  Query: {
    messages: requiresAuth.createResolver(async (parent, { channelId }, { models }) =>
      models.Message.findAll({ order: [['created_at', 'ASC']], where: { channelId } }, { raw: true })),
  },
  Mutation: {
    createMessage: async (parent, args, { models, user }) => {
      try {
        await models.Message.create({
          ...args,
          userId: user.id,
        });
        return true;
      } catch (err) {
        return false;
      }
    },
  },
  Message: {
    user: ({ userId }, args, { models }) => models.User.findOne({ where: { id: userId } }, { raw: true }),
  },
};
