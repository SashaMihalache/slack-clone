import { pick } from 'lodash';

export default (e, models) => {
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map(x => pick(x, ['path', 'message']));
  }
  return [{ path: 'name', message: 'something is wrong' }];
};
