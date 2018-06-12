import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo';
import client from './apollo';

import 'semantic-ui-css/semantic.min.css';

import Router from './routes';
import registerServiceWorker from './registerServiceWorker';

const App = () => (
  <ApolloProvider client={client}>
    <Router />
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
