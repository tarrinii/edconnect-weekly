import React, { useEffect, useState } from 'react';
import { Head } from '@react-ssr/express';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import InputGroup from 'react-bootstrap/InputGroup';
import Template from '../shared/template';
import { ProjectSnippet, fillProjectArray } from '../shared/project';
import api from '../api';

const ProjectSubmit = (props) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchTypes = ['Name', 'Abstract', 'Authors', 'Tags'];

    useEffect(() => {
        const data = {
            search: props.search,
            type: props.type
        };

        api.post(`/project/search`, data)
            .then(project => {
                setProjects(project.data);
                setLoading(false);
            });
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>Project Gallery - Project Explorer</title>
            </Head>
            <Template {...props} loading={loading}>
                {!loading && (
                    <>
                        <h3 className='mt-5'>Project Gallery</h3>
                        <Container>
                            <Row className='p-3 mt-3 mb-5 bg-light text-dark'>
                                <Col>
                                    <Form method='get' action='/projects'>
                                        <Form.Row className='mt-2'>
                                            <Col>
                                                <Form.Control placeholder='Search project name, authors, abstract, tags' type="text" size="lg" name='search' />
                                            </Col>
                                            <Col md='auto'>
                                                <InputGroup>
                                                    <InputGroup.Prepend>
                                                        <InputGroup.Text>Search by</InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <Form.Control as="select" name="type" defaultValue={props.type} size="lg">
                                                        {searchTypes.map((value, index) => (
                                                            <option key={index} value={value}>{value}</option>
                                                        ))}
                                                    </Form.Control>
                                                </InputGroup>
                                            </Col>
                                            <Col md='auto'>
                                                <Button type="submit" size="lg">Submit</Button>
                                            </Col>
                                        </Form.Row>
                                    </Form>
                                </Col>
                            </Row>
                        </Container>
                        <Row className="mb-3">
                            <Col>
                                {props.search ? (
                                    <h5>
                                        <Badge variant="secondary">{props.type}</Badge> {props.search} <small className="text-muted">({projects.length} results)</small>
                                    </h5>
                                ) : (
                                    <h5>All Projects <small className="text-muted">({projects.length} results)</small></h5>
                                )}
                            </Col>
                        </Row>
                        <Container className='px-0 mb-3'>
                            <Row>
                                {fillProjectArray(projects).map((project, index) => (
                                    <Col key={index} className='mb-4'>
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

export default ProjectSubmit;