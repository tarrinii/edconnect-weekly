import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from './header';
import Footer from './footer';
import Loader from './loader';

const Template = (props) => {
    const { children, loading } = props;
    console.log(props);

    return (
        <Container fluid='lg'>
            <Header {...props} />
            <Container className='my-3'>
                {loading ? <Loader /> : children}
            </Container>
            <Footer {...props} />
        </Container>
    );
};

export default Template;