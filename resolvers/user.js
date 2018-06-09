import bcrypt from 'bcrypt';
import { pick } from 'lodash';

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
    register: async (parent, { password, ...otherArgs }, { models }) => {
      try {
        if (password.length < 5) {
          return {
            ok: false,
            errors: [{
              path: 'password',
              message: 'The password should be at least 5 characters long',
            }],
          };
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await models.User.create({ ...otherArgs, password: hashedPassword });

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
  },
};
