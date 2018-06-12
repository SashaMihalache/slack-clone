import React, { Component } from 'react';
import Messages from '../components/Messages';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Comment } from 'semantic-ui-react';

const newChannelMessageSubscription = gql`
  subscription($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        username
      }
      created_at
    }
  }
`;

class MessageContainer extends Component {
  componentWillMount() {
    this.props.data.subscribeToMore({
      document: newChannelMessageSubscription,
      variables: {
        channelId: this.props.channelId
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }
        return {
          ...prev,
          messages: [...prev.messages, subscriptionData.data.newChannelMessage]
        }
      }
    })
  }

  renderSingleComment = (m) => (
    <Comment key={`${m.id}-message`}>
      <Comment.Content>
        <Comment.Author as="a">{m.user.username}</Comment.Author>
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
  variables: props => ({
    channelId: props.channelId
  })
})(MessageContainer);