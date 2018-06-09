import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import cors from 'cors';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

import models from './models';

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

app.use(
  gqlEndpoint,
  bodyParser.json(),
  graphqlExpress({
    schema,
    context: {
      models,
      user: {
        id: 1,
      },
      SECRET,
      SECRET2,
    },
  }),
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

