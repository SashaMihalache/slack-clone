import React from 'react';

import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import Teams from '../components/Teams';
import Channels from '../components/Channels';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';

export default () => (
  <AppLayout>
    <Teams
      teams={[
        { id: 1, letter: 'T' },
        { id: 2, letter: 'W' }
      ]}
    />
    <Channels
      teamName='Team Name'
      username='Username'
      channels={[
        { id: 1, name: 'General' },
        { id: 2, name: 'Random' }
      ]}
      users={[
        { id: 1, name: 'slackbot' },
        { id: 2, name: 'user 1' }
      ]}
    />
    <Header channelName="General" />
    <Messages>
      <ul className="message-list">
        <li />
        <li />
      </ul>
    </Messages>
    <SendMessage channelName='general
    '
    >
      <input type="text" placeholder="CSS Grid Layout Module" />
    </SendMessage>
  </AppLayout>
)