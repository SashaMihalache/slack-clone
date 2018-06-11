import React from 'react';
import { Form, Button, Modal, Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import normalizeErrors from '../../normalizeErrors';

const InvitePeopleModal = ({ open, onClose, values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
  <Modal open={open} onClose={onClose} >
    <Modal.Header>Invite People to your Team</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            name='email'
            fluid
            icon='search'
            placeholder='Member email' />
        </Form.Field>
        {touched.email && errors.email ? errors.email[0] : null}
        <Form.Group>
          <Button disabled={isSubmitting} fluid onClick={onClose}> Cancel </Button>
          <Button disabled={isSubmitting} fluid onClick={handleSubmit}> Add User </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal >
);

const addTeamMemberMutation = gql`
  mutation($email: String!, $teamId: Int!) {
    addTeamMember(email: $email, teamId: $teamId) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default compose(
  graphql(addTeamMemberMutation),
  withFormik({
    mapPropsToValues: () => ({ email: '' }),
    handleSubmit: async (values, { props: { onClose, teamId, mutate }, setSubmitting, resetForm, setErrors }) => {
      const response = await mutate({
        variables: { teamId, email: values.email },
      });

      const { ok, errors } = response.data.addTeamMember;

      if (ok) {
        setSubmitting(false);
        resetForm({});
        onClose();
      } else {
        setSubmitting(false);
        setErrors(normalizeErrors(errors));
      }
    }
  })
)(InvitePeopleModal);
