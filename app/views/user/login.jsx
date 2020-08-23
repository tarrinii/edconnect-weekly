import React from 'react';
import { Head } from '@react-ssr/express';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Template from '../shared/template';

const Login = (props) => {
    return (
        <React.Fragment>
            <Head>
                <title>Login - Project Explorer</title>
            </Head>
            <Template {...props}>
                <Row className="justify-content-center my-5 w-50 mx-auto">
                    <Col>
                        <h3>Login</h3>
                        {props.error.length > 0 && <Alert variant="danger">{props.error}</Alert>}
                        <Form action="/login" method="post">
                            <Form.Group>
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" name="email" placeholder="Enter email" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" name="password" placeholder="Password" />
                            </Form.Group>
                            <Button variant="primary" type="submit">Login</Button>
                        </Form>
                    </Col>
                </Row>
            </Template>
        </React.Fragment>
    );
};

export default Login;