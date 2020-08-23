import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import api from '../api';

export const fillProjectArray = (array) => {
    const columns = 4;
    const emptyColumns = array.length % columns;
    return emptyColumns === 0 ? array : array.concat(new Array(columns - emptyColumns).fill({}));
}

export const ProjectHeader = (props) => {
    const { project, viewMode, user } = props;
    const formatDate = (dateString) => new Date(dateString).toISOString().split('T')[0];
    return (
        <>
            <h3 className='mt-5'>{project.name}</h3>
            <Container>
                <Row className='p-3 mt-3 mb-5 bg-light text-dark'>
                    <Col>Created By <br /> <h6>{`${project.createdBy.firstname} ${project.createdBy.lastname}`}</h6></Col>
                    <Col>Date Created <br /> <h6>{formatDate(project.createdAt)}</h6></Col>
                    <Col>Last Updated <br /> <h6>{formatDate(project.updatedAt)}</h6></Col>
                    <Col className='d-flex justify-content-end'>
                        <div>
                            {viewMode
                                ? (user && user._id === project.createdBy._id)
                                    ? (<Button href={`/projects/${project._id}/edit`}>Edit Project</Button>)
                                    : null
                                : (<Button href={`/projects/${project._id}/view`}>View Project</Button>)
                            }
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export const ProjectSnippet = (props) => {
    return (
        <Card style={{ width: '15.8rem' }}>
            <Card.Body>
                <Card.Title className="text-truncate">
                    <a href={`/projects/${props.project._id}/view`}>{props.project.name}</a></Card.Title>
                <Card.Subtitle className="mb-2 text-muted text-truncate">
                    {props.project.authors.join(', ')}
                </Card.Subtitle>
                <Card.Text>
                    {props.project.abstract.substring(0, 120)}
                </Card.Text>
                <div style={{ width: '210px', height: '24px' }} className='overflow-hidden'>
                    {props.project.tags.map((tag, index) => (
                        <Card.Link key={index} href={`/projects?search=${tag}&type=Tags`}>{`#${tag}`}</Card.Link>
                    ))}
                </div>
            </Card.Body>
        </Card>
    );
}

export const ProjectData = (props) => {
    const { project, viewMode, error, success } = props;
    return (
        <>
            {viewMode ? (<h3>Submit Project</h3>) : (<><h5>Edit Project</h5><hr /></>)}
            {error && error.length > 0 && <Alert variant="danger">{error}</Alert>}
            {success && success.length > 0 && <Alert variant="success">{success}</Alert>}
            <Form action={viewMode ? '/projects/submit' : '/projects/edit'} method="post">
                <Form.Group>
                    <Form.Label>Project name</Form.Label>
                    <Form.Control type="text" name="name" placeholder="Enter project name" defaultValue={project ? project.name : ''} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Project abstract</Form.Label>
                    <Form.Control as="textarea" name="abstract" rows="7" defaultValue={project ? project.abstract : ''} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Author(s)</Form.Label>
                    <Form.Control type="text" name="authors"
                        placeholder="Enter author names (seperated by comma)"
                        defaultValue={project ? project.authors.join(', ') : ''} required
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Tag(s)</Form.Label>
                    <Form.Control type="text" name="tags"
                        placeholder="Use # to tag project with different topics (e.g. #javascript #mongodb)"
                        defaultValue={project ? project.tags.map(_ => '#' + _).join(' ') : ''}
                    />
                </Form.Group>
                {project && <input type="hidden" name="id" defaultValue={project._id} />}
                <Button variant="primary" type="submit">{project ? 'Save' : 'Continue'}</Button>
            </Form>
        </>
    );
}

export class ProjectFileUploader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            files: [],
            isLoading: false
        };
    }

    onFilesChange = (event) => {
        const files = [];
        Object.keys(event.target.files).forEach((key) => {
            files.push(event.target.files[key]);
        })
        this.setState({ files });
    }

    filesRemoveOne = (file) => {
        this.setState((state) => ({
            files: state.files.filter(_ => _.name !== file.name)
        }));
    }

    filesUpload = () => {
        const data = new FormData();
        this.state.files.forEach(file => {
            data.append('file', file);
        });

        this.setState({ isLoading: true });
        api.post(`/project/${this.props.project._id}/files`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
            .then(() => location.reload())
            .catch(error => console.log(error));
    }

    render() {
        return (
            <>
                <Form.File multiple label="Click to open file browser" custom onChange={this.onFilesChange} />
                {this.state.files.length > 0 && (
                    <Card className='mt-3'>
                        <Card.Header className='d-flex justify-content-between align-items-center'>
                            <h5>Pending upload</h5>
                            <Button variant="primary" size='sm' onClick={this.filesUpload} disabled={this.state.isLoading}>
                                {this.state.isLoading ? 'Uploading...' : 'Upload files'}
                            </Button>
                        </Card.Header>
                        <ListGroup variant="flush">
                            {this.state.files.map((file, index) => (
                                <ListGroup.Item key={index} className='d-flex justify-content-between align-items-center'>
                                    <span>{file.name}</span>
                                    <Button variant="link" size='sm' onClick={this.filesRemoveOne.bind(this, file)}>Remove</Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                )}
            </>
        );
    }
}

export class ProjectFileList extends React.Component {
    constructor(props) {
        super(props)
    }

    deleteFile = (id) => {
        api.delete(`/project/${id}/file`)
            .then(() => location.reload())
            .catch(error => console.log(error));
    }

    render() {
        return (
            <>
                <Card className='mt-3'>
                    <Card.Header>
                        <h5>Project files</h5>
                    </Card.Header>
                    {this.props.project.attachments.length > 0 ? (
                        <ListGroup variant="flush">
                            {this.props.project.attachments.map((file, index) => (
                                <ListGroup.Item key={index} className='d-flex justify-content-between align-items-center'>
                                    <span><Badge variant="secondary">{file.mimetype.split('/')[1]}</Badge> <a href={`/download/${file.name}`}>{file.name}</a></span>
                                    {(!this.props.viewMode && this.props.user && this.props.user._id === this.props.project.createdBy._id) && 
                                        <Button variant="link" size='sm' onClick={this.deleteFile.bind(this, file._id)}>Delete</Button>
                                    }
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                            <ListGroup variant="flush">
                                <ListGroup.Item className='d-flex justify-content-center align-items-center'>
                                    <p className="lead">No file uploaded yet</p>
                                </ListGroup.Item>
                            </ListGroup>
                        )}
                </Card>
            </>
        );
    }
}

export default () => null;