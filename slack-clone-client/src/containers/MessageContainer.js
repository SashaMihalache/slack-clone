import React, { Component } from 'react';
import Messages from '../components/Messages';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class MessageContainer extends Component {
  render() {
    const { data: { loading, messages } } = this.props;

    if (loading) {
      return null;
    }

    return (
      <Messages>
      </Messages>
    );
  }
}

const messagesQuery = gql`
  query($channelId: Int!) {
    messages(channelId: $channelId) {
      id
      text
      user {
        username
      }
      createdAt
    }
  }
`;

export default graphql(messagesQuery, {
  variables: props => {
    channelId: props.channelId
  }
})(MessageContainer);