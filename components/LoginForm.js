import React from "react";
import { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
  MessageHeader,
} from "semantic-ui-react";
import { Navigate } from "react-router-dom";

const LoginForm = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const handleLogin = (event) => {
    event.preventDefault();
    const username = event.target[0].value;
    const password = event.target[1].value;
    if (username == "nischal" && password == "1234") {
      console.log("authenticated");
      setAuthenticated(true);
    } else {
      console.log("error");
      setAuthenticated(false);
      setShowErrorMessage(true);
    }
  };
  if (authenticated) {
    return <Navigate to="/home" />;
  }
  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="yellow" textAlign="center">
          Login
        </Header>
        <Form size="large" onSubmit={handleLogin}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="USER NAME"
              type="text"
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="PASSWORD"
              type="password"
            />

            <Button color="yellow" fluid size="large" type="submit">
              Login
            </Button>
          </Segment>
        </Form>
        {showErrorMessage && (
          <Message negative>
            <MessageHeader>Invalid login</MessageHeader>
            <p>We are sorry your credentials are incorrect</p>
          </Message>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default LoginForm;
