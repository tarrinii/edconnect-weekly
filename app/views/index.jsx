import React, { useEffect, useState } from 'react';
import { Head } from '@react-ssr/express';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Template from './shared/template';
import { ProjectSnippet, fillProjectArray } from './shared/project';
import api from './api';

const Index = (props) => {
    const [projects, setProjects] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/project/showcase`)
            .then(projects => {
                setProjects(projects.data);
                setLoading(false);
            });
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>Home - Project Explorer</title>
            </Head>
            <Template {...props} loading={loading}>
                {!loading && (
                    <>
                        <Jumbotron>
                            <h1>Welcome to Project Explorer</h1>
                            <p>
                                Project Explorer is a repository for final year projects across all departments at your institution.
                                You can submit your project and search projects submitted by others to learn from.
                            </p>
                            <p>
                                <Button href="/signup" variant="primary">Get Started</Button> {' '}
                                <Button href="/login" variant="secondary">Login</Button>
                            </p>
                        </Jumbotron>
                        <Container className='px-0 mb-5'>
                            <Row>
                                {fillProjectArray(projects).map((project, index) => (
                                    <Col key={index}>
                                        {project.hasOwnProperty('_id') 
                                            ? <ProjectSnippet key={index} project={project} />
                                            : null
                                        }
                                    </Col>
                                ))}
                            </Row>
                        </Container>
                    </>
                )}

            </Template>
        </React.Fragment>
    );
};

export default Index;