import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';

const Loader = (props) => {
    return (
        <Container>
            <div className="text-center my-5 text-muted">
                <Spinner animation="grow" />
                <h4>Loading data</h4>
            </div>
        </Container>
    );
};

export default Loader;