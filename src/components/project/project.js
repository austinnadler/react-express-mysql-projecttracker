import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import { faPencilAlt, faTrash, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import projects from '../../assets/data/projects';
import tasks from '../../assets/data/tasks';

class Project extends React.Component {
    constructor(props) {
        super(props);
        const pid = this.props.match.params.pid;
        var p = projects.find(p => p.id === parseInt(pid)); // get the project
        p.tasks = tasks.filter(t => t.projectId === parseInt(pid)).sort((a, b) => { return a.id - b.id }); // get tasks associated with the project
        this.state = {
            project: p,
            showTaskForm: false
        };
        // methods that are called without () must be bound
        this.handleProjectSubmit = this.handleProjectSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.showTaskForm = this.showTaskForm.bind(this);
        this.handleTaskSubmit = this.handleTaskSubmit.bind(this);
        this.handleNewTaskNameChange = this.handleNewTaskNameChange.bind(this);
        this.handleNewTaskDescriptionChange = this.handleNewTaskDescriptionChange.bind(this);
        this.handleTaskCancel = this.handleTaskCancel.bind(this);
    }

    componentDidMount() {
        // this is where the select call to the server will go
        document.title = this.state.project.name;
        var table;
        if (this.state.project.tasks.length === 0) {
            table = <h4 className="text-center">{this.state.project.name} has no tasks.</h4>
        } else {
            table =
                <Table bordered responsive>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>State</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.project.tasks.map((t) => {
                                return (
                                    <tr key={t.id}>
                                        <td>{t.name}</td>
                                        <td>{t.description}</td>
                                        <td>{t.state}</td>
                                        <td className="text-center">
                                            <Button variant="success"><FontAwesomeIcon icon={faPencilAlt} /></Button>
                                        </td>
                                        <td className="text-center">
                                            <Button variant="danger"><FontAwesomeIcon icon={faTrash} /></Button>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
        }
        this.setState({ table: table });
    }

    toggleEdit(toggleTo) {
        if (toggleTo) {
            this.setState({
                _project: this.state.project
            });
        }
        if (!toggleTo) {
            this.setState({
                project: this.state._project
            });
        }
        this.setState({ editProject: toggleTo });
    }

    handleNameChange(e) {
        var _project = { ...this.state.project };
        _project.name = e.target.value;
        this.setState({ project: _project });
    }

    handleDescriptionChange(e) {
        var _project = { ...this.state.project };
        _project.description = e.target.value;
        this.setState({ project: _project });
    }

    handleProjectSubmit(e) {
        // This is where the update call to server will go
        e.preventDefault();
        this.setState({
            editProject: false,
            showAlert: true
        });
        document.title = this.state.project.name;
    }

    closeAlert() {
        this.setState({
            showAlert: false
        });
    }

    showTaskForm() {
        this.setState({ showTaskForm: true });
    }

    handleNewTaskNameChange(e) {
        this.setState({ newTaskName: e.target.value });
    }

    handleNewTaskDescriptionChange(e) {
        this.setState({ newTaskDescription: e.target.value });
    }

    handleTaskSubmit() {
        // this is where insert task call to server will go
        let task = {
            id: tasks[tasks.length - 1].id + 1,
            projectId: this.state.project.id,
            name: this.state.newTaskName,
            description: this.state.newTaskDescription
        }
        let _project = this.state.project;
        _project.tasks.push(task);
        this.setState({
            project: _project,
            showTaskForm: false 
        });
    }

    handleTaskCancel() {
        this.setState({ showTaskForm: false });
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
        }

        var topSection;
        if (this.state.editProject) {
            topSection =
                <Col xs={12} md={{ span: 6, offset: 3 }} className="mt-2 mb-2">
                    <Form onSubmit={this.handleProjectSubmit} >
                        <Form.Group>
                            <Form.Label>Project name</Form.Label>
                            <Form.Control type="text" maxLength="200" value={this.state.project.name} onChange={this.handleNameChange}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} value={this.state.project.description} onChange={this.handleDescriptionChange} />
                        </Form.Group>
                        <Button className="mb-2 mr-2" variant="success" type="submit">Submit</Button>
                        <Button className="mb-2" variant="danger" onClick={() => this.toggleEdit(false)}>Cancel</Button>
                    </Form>
                </Col>
        } else {
            topSection =
                <Col xs={12}>
                    <Col xs={12}>
                        <h1 className="m-4 text-success text-center">
                            {this.state.project.name}
                            <Button className="ml-1" onClick={() => this.toggleEdit(true)}><FontAwesomeIcon icon={faPencilAlt} /></Button>
                        </h1>
                    </Col>
                    <Col xs={12} md={{ span: 6, offset: 3 }} className="col-6 col-offset-3">
                        <p><b>Description:</b> {this.state.project.description}</p>
                    </Col>
                </Col>
        }

        return (
            <Container>
                <Row>
                    {alert}
                    {topSection}
                    <Col xs={12} md={{ span: 2, offset: 5 }} className="mb-3 text-center">
                        <Button onClick={this.showTaskForm}><FontAwesomeIcon icon={faPlusSquare} /> New Task</Button>
                    </Col>
                    <Col xs={12}>
                        {this.state.table}
                    </Col>
                </Row>
                <Modal show={this.state.showTaskForm}>
                    <Modal.Header>
                        <Modal.Title>New task for {this.state.project.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Task name</Form.Label>
                            <Form.Control type="text" maxLength="200" value={this.state.newTaskName} onChange={this.handleNewTaskNameChange}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" maxLength="200" rows={3} value={this.state.newTaskDescription} onChange={this.handleNewTaskDescriptionChange} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleTaskSubmit}>
                            Submit
                        </Button>
                        <Button variant="secondary" onClick={this.handleTaskCancel}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container >
        )
    };
}
export default Project;