import React, { useEffect, useState } from 'react';
import { Head } from '@react-ssr/express';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Template from '../shared/template';
import { ProjectHeader, ProjectFileList } from '../shared/project';
import api from '../api';

const ProjectSubmit = (props) => {
    const [project, setProject] = useState(null);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const formatDate = (dateString) => new Date(dateString).toISOString().split('T')[0];

    useEffect(() => {
        api.get(`/project/${props.id}`)
            .then(project => {
                setProject(project.data);
                setLoading(false);
            });
    }, []);

    const saveComment = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const data = {
            message: comment
        }

        api.post(`/project/${project._id}/comment`, data)
            .then(() => location.reload())
            .catch(error => console.log(error));
    }

    const deleteComment = (id) => {
        api.delete(`/project/${id}/comment`)
            .then(() => location.reload())
            .catch(error => console.log(error));
    }

    return (
        <React.Fragment>
            <Head>
                <title>View Project - Project Explorer</title>
            </Head>
            <Template {...props} loading={loading}>
                {!loading && (
                    <>
                        <ProjectHeader project={project} viewMode={true} user={props.user} />
                        <Row className="my-5">
                            <Col>
                                <h5>Project Abstract</h5>
                                <hr />
                                <p className='mb-5' style={{ fontSize: '1.1em' }}>{project.abstract}</p>
                                <h5>Comments</h5>
                                {props.user && (
                                    <Form onSubmit={saveComment}>
                                        <Form.Group>
                                            <Form.Control as="textarea" rows="3" required
                                                value={comment}
                                                onChange={(event) => setComment(event.target.value)}
                                                placeholder='Leave a comment'
                                            />
                                        </Form.Group>
                                        <Button variant="primary" type="submit">Submit</Button>
                                    </Form>
                                )}
                                <hr />
                                {project.comments.length > 0 ? (
                                    <>
                                        {project.comments.map((comment, index) => (
                                            <Card key={index} className='mb-3'>
                                                <Card.Body>
                                                    <Card.Title>
                                                        {`${comment.createdBy.firstname} ${comment.createdBy.lastname}`}
                                                        {props.user && props.user._id === comment.createdBy._id && (
                                                            <button type="button" className="close" onClick={() => deleteComment(comment._id)}>
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        )}
                                                    </Card.Title>
                                                    <Card.Subtitle className="mb-2 text-muted">{formatDate(comment.updatedAt)}</Card.Subtitle>
                                                    <Card.Text>{comment.message}</Card.Text>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </>
                                ) : (
                                        <div className='d-flex justify-content-center align-items-center'>
                                            <p className="lead">No comments added yet</p>
                                        </div>
                                    )}
                            </Col>
                            <Col>
                                <h5>Project Details</h5>
                                <hr />
                                <Card>
                                    <Card.Header><h5>Author(s)</h5></Card.Header>
                                    <ListGroup variant="flush">
                                        {project.authors.map((author, index) => (
                                            <ListGroup.Item key={index}>
                                                <span>{author}</span>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                    <Card.Footer className="text-muted">
                                        {project.tags.map((tag, index) => (
                                            <span key={index} className='mr-2'>
                                                <a href={`/projects?search=${tag}&type=Tags`}>{`#${tag}`}</a>
                                            </span>
                                        ))}
                                    </Card.Footer>
                                </Card>
                                <ProjectFileList project={project} viewMode={true} user={props.user} />
                            </Col>
                        </Row>
                    </>
                )}
            </Template>
        </React.Fragment>
    );
};

export default ProjectSubmit;