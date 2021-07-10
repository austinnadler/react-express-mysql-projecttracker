import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProjectInfo from './projectInfo';
import ProjectTable from './projectTable';
import TaskForm from './taskForm';
import projects from '../../assets/data/projects';
import tasks from '../../assets/data/tasks';

class Project extends React.Component {
    constructor(props) {
        super(props);
        const pid = this.props.match.params.pid;
        var p = projects.find(p => p.id === parseInt(pid)); // get the project
        p.tasks = tasks.filter(t => t.projectId === parseInt(pid)).sort((a, b) => { return a.id - b.id }); // get tasks associated with the project
        this.state = {
            project: p
        };
        // methods that are called without () must be bound
        this.closeAlert = this.closeAlert.bind(this);
    }

    componentDidMount() {
        // this is where the select call to the server will go
        document.title = this.state.project.name;
    }

    toggleEdit(toggleTo) {
        if (toggleTo === true) {
            this.setState({
                _project: this.state.project // _project is used in the change methods of the fields in the modal
            });
        } else {
            this.setState({
                project: this.state.project
            });
        }
        this.setState({ editProject: toggleTo });
    }

    

    closeAlert() {
        this.setState({
            showAlert: false
        });
    }

   

    render() {
        var alert;
        if (this.state.showAlert) {
            alert = <Alert show={this.state.showAlert} variant="success" className="m-4" onClose={this.closeAlert} dismissible>
                <Alert.Heading>Project updated.</Alert.Heading>
                <hr />
                <b>Name:</b>
                <div>{this.state.project.name}</div>
                <b>Description:</b>
                <div>{this.state.project.description}</div>
            </Alert>;
        } else {
            alert = null;
        }



        return (
            <Container>
                <Row>
                    {alert}
                    <ProjectInfo project={this.state.project} />
                    <TaskForm project={this.state.project} />
                    <ProjectTable project={this.state.project}/>
                </Row>
                
            </Container>
        )
    };
}
export default Project;