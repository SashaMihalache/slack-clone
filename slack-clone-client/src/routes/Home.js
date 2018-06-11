import React from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const Home = ({ data: { allUsers = [] } }) => {
  return (
    <div>
      <Link to={`/team/view`} >Chat Room</Link>
      <Link to={`/team/new`} >New Team</Link>
      <Link to={`/login`} >Login</Link>
      <Link to={`/register`} >Register</Link>
      {allUsers.map(u => <h1 key={u.id}>{u.email}</h1>)}
    </div>
  )
}

const allUsersQuery = gql`
  {
    allUsers {
      id
      email
    }
  }
`;

export default graphql(allUsersQuery)(Home);