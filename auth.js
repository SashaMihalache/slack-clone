import jwt from 'jsonwebtoken';
import { pick } from 'lodash';
import bcrypt from 'bcrypt';

export const createTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign(
    {
      user: pick(user, ['id']),
    },
    secret,
    {
      expiresIn: '1h',
    },
  );

  const createRefreshToken = jwt.sign(
    {
      user: pick(user, 'id'),
    },
    secret2,
    {
      expiresIn: '7d',
    },
  );

  return [
    createToken,
    createRefreshToken,
  ];
};


export const tryLogin = async (email, password, models, SECRET, SECRET2) => {
  const user = await models.User.findOne({
    where: { email },
    raw: true,
  });

  if (!user) {
    return {
      ok: false,
      errors: [{ path: 'email', message: 'No user with this email exists' }],
    };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return {
      ok: false,
      errors: [{ path: 'password', message: 'Wrong email or password' }],
    };
  }

  const refreshTokenSecret = `${user.password}${SECRET2}`;

  const [
    token,
    refreshToken,
  ] = await createTokens(user, SECRET, refreshTokenSecret);

  return {
    ok: true,
    token,
    refreshToken,
  };
};

