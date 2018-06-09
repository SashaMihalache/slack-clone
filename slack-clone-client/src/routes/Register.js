import React, { Component } from 'react';
import { Container, Header, Input, Button } from 'semantic-ui-react';
import { gql, graphql } from 'react-apollo';

class Register extends Component {

  state = {
    username: '',
    email: '',
    password: ''
  }

  onChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  onSubmit = async () => {
    const response = await this.props.mutate({
      variables: this.state
    });
    console.log(response);
  }

  render() {
    const { username, email, password } = this.state;

    return (
      <Container text>
        <Header as='h2'>Register</Header>
        <Input name='username' onChange={this.onChange} value={username} placeholder='username' fluid />
        <Input name='email' onChange={this.onChange} value={email} placeholder='email' fluid />
        <Input name='password' onChange={this.onChange} value={password} placeholder='password' type='password' fluid />
        <Button onClick={this.onSubmit}>Submit</Button>
      </Container>
    );
  }
}

const registerMutation = gql`
  mutation register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password)
  }
`;

export default graphql(registerMutation)(Register);