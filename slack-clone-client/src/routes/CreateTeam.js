import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { extendObservable } from 'mobx';
import { Container, Header, Input, Button, Form, Message } from 'semantic-ui-react';
import { gql, graphql } from 'react-apollo';

class CreateTeam extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      name: '',
      errors: {}
    })
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this[name] = value;
  }

  onSubmit = async () => {
    const { name } = this;
    const response = await this.props.mutate({
      variables: { name }
    })

    const { ok, errors } = response.data.createTeam;

    if (ok) {
      this.props.history.push('/');
    } else {
      this.handleFormErrors(errors);
    }
  }

  handleFormErrors = (errors) => {
    const err = {};
    errors.forEach(({ path, message }) => {
      err[`${path}Error`] = message;
    });

    this.errors = err;
  }

  handleErrorMessage = ({ nameError }) => {
    const errorList = [];

    if (nameError) {
      errorList.push(nameError);
    }

    return errorList.length
      ? <Message
        error
        header="There was something wrong with your submission"
        list={errorList}
      />
      : null
  }

  render() {
    const { name, errors: { nameError } } = this;

    return (
      <Container text>
        <Header as='h2'>Create Team</Header>
        <Form>
          <Form.Field error={!!nameError} >
            <Input
              name='name'
              onChange={this.onChange}
              value={name}
              placeholder='name'
              fluid
            />
          </Form.Field>
          <Button onClick={this.onSubmit}>Submit</Button>
        </Form>

        {this.handleErrorMessage(this.errors)}

      </Container>
    );
  }
}

const createTeamMutation = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(createTeamMutation)(observer(CreateTeam));