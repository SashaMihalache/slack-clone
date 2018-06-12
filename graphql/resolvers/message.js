import { PubSub, withFilter } from 'graphql-subscriptions';
import requiresAuth from '../../permissions';

const pubsub = new PubSub();

const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

export default {
  Subscription: {
    newChannelMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
        (payload, args) => payload.channelId === args.channelId,
      ),
    },
  },
  Query: {
    messages: requiresAuth.createResolver(async (parent, { channelId }, { models }) =>
      models.Message.findAll({ order: [['created_at', 'ASC']], where: { channelId } }, { raw: true })),
  },
  Mutation: {
    createMessage: async (parent, args, { models, user }) => {
      try {
        const message = await models.Message.create({
          ...args,
          userId: user.id,
        });

        const asyncFunc = async () => {
          const currentUser = await models.User.findOne({
            where: {
              id: user.id,
            },
          });

          pubsub.publish(NEW_CHANNEL_MESSAGE, {
            channelId: args.channelId,
            newChannelMessage: {
              ...message.dataValues,
              user: currentUser.dataValues,
            },
          });
        };

        asyncFunc();

        return true;
      } catch (err) {
        return false;
      }
    },
  },
  Message: {
    user: ({ userId, user }, args, { models }) => {
      if (user) {
        return user;
      }
      return models.User.findOne({ where: { id: userId } }, { raw: true });
    },
  },
};
