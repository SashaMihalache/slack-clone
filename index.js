import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import cors from 'cors';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import jwt from 'jsonwebtoken';

import models from './models';
import { refreshTokens } from './auth';

const typesArray = fileLoader(path.join(__dirname, './graphql/schema'));
const resolversArray = fileLoader(path.join(__dirname, './graphql/resolvers'));

const typeDefs = mergeTypes(typesArray);
const resolvers = mergeResolvers(resolversArray);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const PORT = 8080;
const SECRET = 'somethingsecret';
const SECRET2 = 'somethingsecretmore';
const gqlEndpoint = '/graphql';
const app = express();

app.use(cors('http://localhost:3000'));

const addUserMiddleware = async (req, res, next) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token', 'x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};

app.use(addUserMiddleware);

app.use(
  gqlEndpoint,
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: {
      models,
      user: req.user,
      SECRET,
      SECRET2,
    },
  })),
);

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: gqlEndpoint,
  }),
);

// sync({ force: true }) //force for dropping
models.sequelize.sync().then(() => {
  console.log('Db is synced');
  app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
});

