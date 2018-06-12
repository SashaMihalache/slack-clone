import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

const SendMesssageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;

const SendMessage = ({ channelName, values, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
  const handleFormSubmitOnEnter = (e) => {
    if (e.keyCode === 13 && !isSubmitting) {
      handleSubmit(e);
    }
  }

  return (
    <SendMesssageWrapper>
      <Input
        onKeyDown={handleFormSubmitOnEnter}
        name='message'
        value={values.message}
        onBlur={handleBlur}
        onChange={handleChange}
        fluid
        placeholder={`Message # ${channelName}`} />
    </SendMesssageWrapper>
  );
}

const createMessageMutation = gql`
  mutation ($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

export default compose(
  graphql(createMessageMutation),
  withFormik({
    mapPropsToValues: () => ({ message: '' }),
    handleSubmit: async (values, { props: { channelId, mutate }, setSubmitting, resetForm }) => {
      if (!values.message || !values.message.trim()) {
        setSubmitting(false);
        return;
      }

      await mutate({
        variables: { channelId, text: values.message }
      });
      setSubmitting(false);
      resetForm(false);
    }
  })
)(SendMessage);
