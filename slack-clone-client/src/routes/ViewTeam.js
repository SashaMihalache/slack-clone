import React from 'react';

import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import Teams from '../components/Teams';
import Channels from '../components/Channels';
import Messages from '../components/Messages';
import Input from '../components/Input';

export default () => (
  <AppLayout>
    <Teams>Teams</Teams>
    <Channels>Channels</Channels>
    <Header>Header</Header>
    <Messages>
      <ul className="message-list">
        <li />
        <li />
      </ul>
    </Messages>
    <Input >
      <input type="text" placeholder="CSS Grid Layout Module" />
    </Input>
  </AppLayout>
)