import React from 'react';
import { Head } from '@react-ssr/express';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Template from '../shared/template';
import { ProjectData } from '../shared/project';

const ProjectSubmit = (props) => {
    return (
        <React.Fragment>
            <Head>
                <title>Submit Project - Project Explorer</title>
            </Head>
            <Template {...props}>
                <Row className="justify-content-center my-5 w-50 mx-auto">
                    <Col>
                        <ProjectData viewMode={true} error={props.error} />
                    </Col>
                </Row>
            </Template>
        </React.Fragment>
    );
};

export default ProjectSubmit;