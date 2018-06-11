import React from 'react';
import { gql, graphql } from 'react-apollo';
import { findIndex } from 'lodash';
import decode from 'jwt-decode';
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

  const teamIdx = findIndex(allTeams, ['id', currentTeamId])
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