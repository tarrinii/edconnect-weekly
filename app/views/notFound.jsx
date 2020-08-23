import React from 'react';
import { Head } from '@react-ssr/express';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Template from './shared/template';

const NotFound = (props) => {
    return (
        <React.Fragment>
            <Head>
                <title>Not found - Project Explorer</title>
            </Head>
            <Template {...props}>
                <Jumbotron>
                    <h1>Page not found</h1>
                    <p>The page you are looking for is unfortunately not available.</p>
                </Jumbotron>
            </Template>
        </React.Fragment>
    );
};

export default NotFound;