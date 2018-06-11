import jwt from 'jsonwebtoken';
import pick from 'lodash/lodash';
import bcrypt from 'bcrypt';

export const createTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign(
    {
      user: pick(user, ['id', 'username']),
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

export const refreshTokens = async (token, refreshToken, models, SECRET, SECRET2) => {
  let userId = 0;

  try {
    const { user: { id } } = jwt.decode(refreshToken);
    userId = id;
  } catch (error) {
    return {};
  }

  if (!userId) {
    return {};
  }

  // raw to not get sequelize obj
  const user = await models.User.findOne({ where: { id: userId }, raw: true });

  if (!user) {
    return {};
  }

  const refreshSecret = user.password + SECRET2;

  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (error) {
    return {};
  }

  const [newToken, newRefreshToken] = await createTokens(user, SECRET, refreshSecret);
  return {
    token: newToken,
    refreshToken: newRefreshToken,
  };
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

