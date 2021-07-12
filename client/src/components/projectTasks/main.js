import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ProjectInfo from './projectInfo';
import TaskTable from './taskTable';

const ProjectTasks = (props) => {
    return (
        <Container>
            <Row>
                <ProjectInfo projectId={props.match.params.pid} />
                <TaskTable projectId={props.match.params.pid} />
            </Row>
        </Container>
    )
}
export default ProjectTasks;