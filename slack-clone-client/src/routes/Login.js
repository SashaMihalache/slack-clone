import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { extendObservable } from 'mobx';
import { Container, Header, Input, Button, Form, Message } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class Login extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      email: '',
      password: '',
      errors: {}
    })
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this[name] = value;
  }

  onSubmit = async () => {
    const { email, password } = this;
    const response = await this.props.mutate({
      variables: { email, password }
    })

    const { ok, token, refreshToken, errors } = response.data.login;

    if (ok) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
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

  handleErrorMessage = ({ passwordError, emailError }) => {
    const errorList = [];

    if (passwordError) {
      errorList.push(passwordError)
    }

    if (emailError) {
      errorList.push(emailError);
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
    const { email, password, errors: { emailError, passwordError } } = this;

    return (
      <Container text>
        <Header as='h2'>Login</Header>
        <Form>
          <Form.Field error={!!emailError} >
            <Input
              name='email'
              onChange={this.onChange}
              value={email}
              placeholder='email'
              fluid
            />
          </Form.Field>
          <Form.Field error={!!passwordError}>
            <Input
              name='password'
              onChange={this.onChange}
              value={password}
              placeholder='password'
              type='password'
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

const loginMutation = gql`
  mutation($email: String!, $password: String!) {
          login(email: $email, password: $password) {
          ok
      token
        refreshToken
      errors {
          path
        message
        }
      }
    }
  `;

export default graphql(loginMutation)(observer(Login));