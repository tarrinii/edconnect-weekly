import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

const Footer = (props) => {
    return (
        <Container>
            <Navbar bg="light" variant="light">
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        Project Explorer &#169; 2020 &#183; <a href="https://edconnect.ng/" target="_blank">Edconnect</a>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
        </Container>
    );
};

export default Footer;