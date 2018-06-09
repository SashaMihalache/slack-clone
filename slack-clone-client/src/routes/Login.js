import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { extendObservable } from 'mobx';
import { Container, Header, Input, Button, Message } from 'semantic-ui-react';

export default observer(
  class Login extends Component {
    constructor(props) {
      super(props);

      extendObservable(this, {
        email: '',
        password: ''
      })
    }

    onChange = (e) => {
      const { name, value } = e.target;
      this[name] = value;
    }

    onSubmit = () => {
      const { email, password } = this;
      console.log(email, password);
    }

    render() {
      const { email, password } = this;

      return (
        <Container text>
          <Header as='h2'>Login</Header>
          <Input
            name='email'
            onChange={this.onChange}
            value={email}
            placeholder='email'
            fluid
          />
          <Input
            name='password'
            onChange={this.onChange}
            value={password}
            placeholder='password'
            type='password'
            fluid
          />
          <Button onClick={this.onSubmit}>Submit</Button>
        </Container>
      );
    }
  }
)