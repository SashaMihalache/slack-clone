import React from 'react';
import { Form, Button, Modal, Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

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
    createChannel(teamId: $teamId, name: $name)
  }
`;

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ name: '' }),
    handleSubmit: async (values, { props: { onClose, teamId, mutate }, setSubmitting, resetForm }) => {
      const response = await mutate({
        variables: {
          teamId,
          name: values.name
        }
      })
      setSubmitting(false);
      resetForm({});
      onClose();
    }
  })
)(AddChannelModal);
