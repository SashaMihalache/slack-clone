import React from 'react';
import { graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import decode from 'jwt-decode';
import gql from 'graphql-tag';
import Teams from '../components/Teams';
import Channels from '../components/Channels';

const Sidebar = ({ data: { allTeams, loading, error }, currentTeamId }) => {
  if (error) {
    console.error(error);
    return null;
  }

  if (loading) {
    return null;
  }

  const teamIdx = currentTeamId ? findIndex(allTeams, ['id', parseInt(currentTeamId, 10)]) : 0;
  const team = allTeams[teamIdx];
  let username = '';

  try {
    const token = localStorage.getItem('token');
    const tkn = decode(token);
    // eslint-disable-next-line
    username = tkn.user.username;
  } catch (error) { }

  return (
    <React.Fragment>
      <Teams
        teams={allTeams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase()
        }))}
      />
      <Channels
        teamName={team.name}
        username={username}
        channels={team.channels}
        users={[
          { id: 1, name: 'slackbot' },
          { id: 2, name: 'user1' }
        ]}
      />
    </React.Fragment>
  )
}

const allTeamsQuery = gql`
  {
    allTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;

export default graphql(allTeamsQuery)(Sidebar);