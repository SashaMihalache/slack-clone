import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo';
import 'semantic-ui-css/semantic.min.css';

import Router from './routes';
import registerServiceWorker from './registerServiceWorker';

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:8080/graphql',
});

const client = new ApolloClient({
  networkInterface,
});

const App = () => (
  <ApolloProvider client={client}>
    <Router />
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
