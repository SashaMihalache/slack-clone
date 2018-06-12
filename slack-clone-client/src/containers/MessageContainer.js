import React, { Component } from 'react';
import Messages from '../components/Messages';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Comment } from 'semantic-ui-react';

class MessageContainer extends Component {
  renderSingleComment = (m) => (
    <Comment key={`${m.id}-message`}>
      <Comment.Content>
        <Comment.Author>{m.user.username}</Comment.Author>
        <Comment.Metadata>
          <div>{m.created_at}</div>
        </Comment.Metadata>
        <Comment.Text>{m.text}</Comment.Text>
        <Comment.Actions>
          <Comment.Action>Reply</Comment.Action>
        </Comment.Actions>
      </Comment.Content>
    </Comment>
  )

  render() {
    const { data: { loading, messages } } = this.props;

    if (loading) {
      return null;
    }

    console.log(messages);
    return (
      <Messages>
        <Comment.Group>
          {messages.map(this.renderSingleComment)}
        </Comment.Group>
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
      created_at
    }
  }
`;

export default graphql(messagesQuery, {
  variables: props => {
    channelId: props.channelId
  }
})(MessageContainer);