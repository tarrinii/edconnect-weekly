import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

const Header = (props) => {
    return (
        <Navbar bg="primary" variant="dark">
            <Navbar.Brand href="/">Project Explorer</Navbar.Brand>
            <Form method='get' action='/projects' inline>
                <FormControl type="text" placeholder="Search Projects" className="mr-sm-2" name='search' />
                <input type='hidden' name='type' value='Name' />
                <Button variant="outline-light" type="submit">Search</Button>
            </Form>
            <Nav className="mr-auto">
                <Nav.Link href="/projects">Projects</Nav.Link>
                <Nav.Link href="/projects/submit">Submit</Nav.Link>
            </Nav>
            {props.user ? (
                    <Nav>
                        <Navbar.Text>
                            Signed in as: <a href="/profile">{props.user.displayName}</a>
                        </Navbar.Text>
                        <Nav.Link href="/logout">Logout</Nav.Link>
                    </Nav>
                ) : (
                    <Nav>
                        <Nav.Link href="/signup">Sign up</Nav.Link>
                        <Nav.Link href="/login">Login</Nav.Link>
                    </Nav>
                )
            }
        </Navbar>
    );
};

export default Header;