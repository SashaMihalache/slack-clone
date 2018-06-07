import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const PORT = 8080;
const gqlEndpoint = '/graphql';
const app = express();

app.use(
  gqlEndpoint,
  bodyParser.json(),
  graphqlExpress({
    schema,
  }),
);

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: gqlEndpoint,
  }),
);

// sync({ force: true }) //force for dropping
models.sequelize.sync({ force: true }).then(() => {
  console.log('Db is synced');
  app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
});

