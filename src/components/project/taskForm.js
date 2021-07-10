import React from "react";
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import tasks from '../../assets/data/tasks';

class TaskForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: props.project,
            showTaskForm: false
        }
        this.showTaskForm = this.showTaskForm.bind(this);
        this.handleTaskSubmit = this.handleTaskSubmit.bind(this);
        this.handleNewTaskNameChange = this.handleNewTaskNameChange.bind(this);
        this.handleNewTaskDescriptionChange = this.handleNewTaskDescriptionChange.bind(this);
        this.handleTaskCancel = this.handleTaskCancel.bind(this);
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
        return (
            <Col xs={12} md={{ span: 2, offset: 5 }} className="mb-3 text-center">
                <Button onClick={this.showTaskForm}><FontAwesomeIcon icon={faPlusSquare} /> New Task</Button>
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
            </Col>

        )
    }
}
export default TaskForm;