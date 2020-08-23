import React, { useEffect, useState } from 'react';
import { Head } from '@react-ssr/express';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Template from '../shared/template';
import api from '../api';

const Profile = (props) => {
    const graduationYears = [...Array(20).fill().map((_, i) => i + 2001)].reverse();
    const [programs, setPrograms] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/program'),
            api.get(`/user/${props.user._id}`)
        ])
            .then(values => {
                const [programs, user] = values;
                setPrograms(programs.data);
                setUser(user.data);
                setLoading(false);
            });
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>{`${props.user.displayName} - Project Explorer`}</title>
            </Head>
            <Template {...props} loading={loading}>
                {!loading && (
                    <>
                        <h3 className='mt-5'>{`${user.firstname} ${user.lastname}`} <small className="text-muted">{user.email}</small></h3>
                        <Container>
                            <Row className='p-3 mt-3 mb-5 bg-light text-dark'>
                                <Col>Program <br /> <h6>{user.program.name}</h6></Col>
                                <Col>Matriculation number <br /> <h6>{user.matricNumber}</h6></Col>
                                <Col>Graduation year <br /> <h6>{user.graduationYear}</h6></Col>
                            </Row>
                        </Container>
                        <h5>Update Profile</h5>
                        <hr />
                        <Row className="justify-content-center my-5 w-75 mx-auto">
                            <Col>
                                {props.profileSuccess.length > 0 && <Alert variant="success">{props.profileSuccess}</Alert>}
                                {props.profileError.length > 0 && <Alert variant="danger">{props.profileError}</Alert>}
                                <Form action="/profile" method="post">
                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Label>First name</Form.Label>
                                            <Form.Control type="text" name="firstname" defaultValue={user.firstname} required />
                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            <Form.Label>Last name</Form.Label>
                                            <Form.Control type="text" name="lastname" defaultValue={user.lastname} required />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Label>Email Address</Form.Label>
                                            <Form.Control type="email" name="email" defaultValue={user.email} required />
                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            <Form.Label>Program</Form.Label>
                                            <Form.Control as="select" name="program" defaultValue={user.program._id} required>
                                                <option value=''>Choose...</option>
                                                {programs.map((value, index) => (
                                                    <option key={index} value={value._id}>{value.name}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Label>Matriculation number</Form.Label>
                                            <Form.Control type="text" name="matricNumber" defaultValue={user.matricNumber} required />
                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            <Form.Label>Graduation year</Form.Label>
                                            <Form.Control as="select" name="graduationYear" defaultValue={user.graduationYear} required>
                                                <option value=''>Choose...</option>
                                                {graduationYears.map((value, index) => (
                                                    <option key={index} value={value}>{value}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Form.Row>
                                    <Button variant="primary" type="submit">Update Profile</Button>
                                </Form>
                            </Col>
                        </Row>

                        <h5>Change Password</h5>
                        <hr />
                        <Row className="justify-content-center my-5 w-75 mx-auto">
                            <Col>
                                {props.passwordSuccess.length > 0 && <Alert variant="success">{props.passwordSuccess}</Alert>}
                                {props.passwordError.length > 0 && <Alert variant="danger">{props.passwordError}</Alert>}
                                <Form action="/password" method="post">
                                    <Form.Row>
                                        <Form.Group as={Col} md={4}>
                                            <Form.Label>Current password</Form.Label>
                                            <Form.Control type="password" name="password" placeholder="Current Password" required />
                                        </Form.Group>

                                        <Form.Group as={Col} md={4}>
                                            <Form.Label>New password</Form.Label>
                                            <Form.Control type="password" name="new_password" placeholder="Your new password" required />
                                        </Form.Group>

                                        <Form.Group as={Col} md={4}>
                                            <Form.Label>Confirm password</Form.Label>
                                            <Form.Control type="password" name="confirm_password" placeholder="Confirm new password" required />
                                        </Form.Group>
                                    </Form.Row>
                                    <Button variant="primary" type="submit">Change Password</Button>
                                </Form>
                            </Col>
                        </Row>
                    </>
                )}
            </Template>
        </React.Fragment>
    );
};

export default Profile;