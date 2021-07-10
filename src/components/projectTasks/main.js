import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ProjectInfo from './projectInfo';
import TaskTable from './taskTable';
import projects from '../../assets/data/projects';
import tasks from '../../assets/data/tasks';

class ProjectTasks extends React.Component {
    constructor(props) {
        super(props);
        const pid = this.props.match.params.pid;
        var p = projects.find(p => p.id === parseInt(pid)); // get the project
        p.tasks = tasks.filter(t => t.projectId === parseInt(pid)).sort((a, b) => { return a.id - b.id }); // get tasks associated with the project
        this.state = {
            project: p
        };
    }

    componentDidMount() {
        // this is where the select call to the server will go. or will it go in contructor?
    }    

    render() {
        return (
            <Container>
                <Row>
                    <ProjectInfo project={this.state.project} />
                    <TaskTable project={this.state.project}/>
                </Row>                
            </Container>
        )
    };
}
export default ProjectTasks;