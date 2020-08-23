import React, { useEffect, useState } from 'react';
import { Head } from '@react-ssr/express';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Template from '../shared/template';
import { ProjectHeader, ProjectData, ProjectFileUploader, ProjectFileList } from '../shared/project';
import api from '../api';

const ProjectSubmit = (props) => {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/project/${props.id}`)
            .then(project => {
                setProject(project.data);
                setLoading(false);
            });
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>Edit Project - Project Explorer</title>
            </Head>
            <Template {...props} loading={loading}>
                {!loading && (
                    <>
                        <ProjectHeader project={project} viewMode={false} user={props.user} />
                        <Row className="my-5">
                            <Col>
                                <ProjectData project={project} viewMode={false} error={props.error} success={props.success} />
                            </Col>
                            <Col>
                                <h5>Manage Project files</h5>
                                <hr />
                                <ProjectFileUploader project={project} />
                                <hr />
                                <ProjectFileList project={project} viewMode={false} user={props.user} />
                            </Col>
                        </Row>
                    </>
                )}
            </Template>
        </React.Fragment>
    );
};

export default ProjectSubmit;