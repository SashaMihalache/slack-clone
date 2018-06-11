import React from 'react';
import { graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';

import { allTeamsQuery } from '../graphql/team';
import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';

const ViewTeam = ({ data: { loading, error, allTeams }, match: { params: { teamId, channelId } } }) => {
  if (loading) {
    return null;
  }

  if (error) {
    console.log(error);
  }

  const teamIdx = !!teamId ? findIndex(allTeams, ['id', parseInt(teamId, 10)]) : 0;
  const team = allTeams[teamIdx];

  const channelIdx = !!channelId ? findIndex(team.channels, ['id', parseInt(channelId, 10)]) : 0;
  const channel = team.channels[channelIdx];

  return (
    <AppLayout>
      <Sidebar
        teams={allTeams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase()
        }))}
        team={team} />
      <Header channelName={channel.name} />
      <Messages channelId={channel.id} >
        <ul className="message-list">
          <li />
          <li />
        </ul>
      </Messages>
      <SendMessage channelName={channel.name} >
        <input type="text" placeholder="CSS Grid Layout Module" />
      </SendMessage>
    </AppLayout>
  )
}

export default graphql(allTeamsQuery)(ViewTeam);