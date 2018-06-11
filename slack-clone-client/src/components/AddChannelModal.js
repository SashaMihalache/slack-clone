import React from 'react';
import { Form, Button, Modal, Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import findIndex from 'lodash/findIndex';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { allTeamsQuery } from '../graphql/team';

const AddChannelModal = ({ open, onClose, values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
  <Modal open={open} onClose={onClose} >
    <Modal.Header>Add Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            name='name'
            fluid
            icon='search'
            placeholder='Channel name' />
        </Form.Field>
        <Form.Group>
          <Button disabled={isSubmitting} fluid onClick={onClose}> Cancel </Button>
          <Button disabled={isSubmitting} fluid onClick={handleSubmit}> Create Channel </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal >
);

const createChannelMutation = gql`
  mutation($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
      ok
      channel {
        id
        name
      }
    }
  }
`;

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ name: '' }),
    handleSubmit: async (values, { props: { onClose, teamId, mutate }, setSubmitting, resetForm }) => {
      await mutate({
        variables: { teamId, name: values.name },
        optimisticResponse: {
          createChannel: {
            __typename: 'Mutation',
            ok: true,
            channel: {
              __typename: 'Channel',
              id: -1,
              name: values.name
            }
          }
        },
        update: (store, { data: { createChannel } }) => {
          const { ok, channel } = createChannel;

          if (!ok) {
            return
          }

          const data = store.readQuery({ query: allTeamsQuery });
          const teamIdx = findIndex(data.allTeams, ['id', teamId]);
          data.allTeams[teamIdx].channels.push(channel);
          store.writeQuery({ query: allTeamsQuery, data });
        }
      });
      setSubmitting(false);
      resetForm({});
      onClose();
    }
  })
)(AddChannelModal);
