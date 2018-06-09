import bcrypt from 'bcrypt';
import { pick } from 'lodash';
import { tryLogin } from '../../auth';

const formatErrors = (e, models) => {
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map(x => pick(x, ['path', 'message']));
  }
  return [{ path: 'name', message: 'something is wrong' }];
};


export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: { // { models } === context.models, comes from index, sequelize context inside
    register: async (parent, args, { models }) => {
      try {
        const user = await models.User.create(args);

        return {
          ok: true,
          user,
        };
      } catch (error) {
        return {
          ok: false,
          errors: formatErrors(error, models),
        };
      }
    },
    login: async (parent, { email, password }, { models, SECRET, SECRET2 }) =>
      tryLogin(email, password, models, SECRET, SECRET2),
  },
};
