import React, { Component } from 'react';
import { Container, Header, Input, Button, Message } from 'semantic-ui-react';
import { gql, graphql } from 'react-apollo';
import { addErrorLoggingToSchema } from 'graphql-tools';

class Register extends Component {

  state = {
    username: '',
    usernameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: ''
  }

  onChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  onSubmit = async () => {
    this.setState({
      usernameError: '',
      passwordError: '',
      emailError: ''
    });

    const { username, email, password } = this.state;
    const response = await this.props.mutate({
      variables: { username, email, password }
    });

    const { ok, errors } = response.data.register;
    console.log(response);

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

    this.setState(err);
  }

  handleErrorMessage = ({ usernameError, passwordError, emailError }) => {
    const errorList = [];

    if (usernameError) {
      errorList.push(usernameError)
    }

    if (passwordError) {
      errorList.push(passwordError)
    }

    if (emailError) {
      errorList.push(emailError);
    }

    return (usernameError || passwordError || emailError)
      ? <Message
        error
        header="There was something wrong with your submission"
        list={errorList}
      />
      : null
  }

  render() {
    const { username, usernameError, email, emailError, password, passwordError } = this.state;

    return (
      <Container text>
        <Header as='h2'>Register</Header>
        <Input
          error={!!usernameError}
          name='username'
          onChange={this.onChange}
          value={username}
          placeholder='username'
          fluid />
        <Input
          error={!!emailError}
          name='email'
          onChange={this.onChange}
          value={email}
          placeholder='email'
          fluid />
        <Input
          error={!!passwordError}
          name='password'
          onChange={this.onChange}
          value={password}
          placeholder='password'
          type='password' fluid />
        <Button onClick={this.onSubmit}>Submit</Button>
        {
          this.handleErrorMessage(this.state)
        }
      </Container>
    );
  }
}

const registerMutation = gql`
  mutation register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(registerMutation)(Register);