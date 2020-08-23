import React, { useEffect, useState } from 'react';
import { Head } from '@react-ssr/express';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Template from '../shared/template';
import api from '../api';

const Signup = (props) => {
    const graduationYears = [...Array(20).fill().map((_, i) => i + 2001)].reverse();
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        api.get('/program')
            .then(response => {
                setPrograms(response.data);
            }); 
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>Signup - Project Explorer</title>
            </Head>
            <Template {...props}>
                <Row className="justify-content-center my-5 w-75 mx-auto">
                    <Col>
                        <h3>Sign up</h3>
                        {props.error.length > 0 && <Alert variant="danger">{props.error}</Alert>}
                        <Form action="/signup" method="post">
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>First name</Form.Label>
                                    <Form.Control type="text" name="firstname" placeholder="First name" required />
                                </Form.Group>

                                <Form.Group as={Col}>
                                    <Form.Label>Last name</Form.Label>
                                    <Form.Control type="text" name="lastname" placeholder="Last name" required />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control type="email" name="email" placeholder="Your Email address" required />
                                </Form.Group>

                                <Form.Group as={Col}>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" name="password" placeholder="Your Password" required />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} md={6}>
                                    <Form.Label>Program</Form.Label>
                                    <Form.Control as="select" name="program" defaultValue="Choose..." required>
                                        <option value=''>Choose...</option>
                                        {programs.map((value, index) => (
                                            <option key={index} value={value._id}>{value.name}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group as={Col}>
                                    <Form.Label>Matriculation number</Form.Label>
                                    <Form.Control type="text" name="matricNumber" placeholder="e.g. 16/2020" required />
                                </Form.Group>

                                <Form.Group as={Col}>
                                    <Form.Label>Graduation year</Form.Label>
                                    <Form.Control as="select" name="graduationYear" defaultValue="Choose..." required>
                                        <option value=''>Choose...</option>
                                        {graduationYears.map((value, index) => (
                                            <option key={index} value={value}>{value}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>
                            <Button variant="primary" type="submit">Sign up</Button>
                        </Form>
                    </Col>
                </Row>
            </Template>
        </React.Fragment>
    );
};

export default Signup;