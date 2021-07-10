import React from "react";
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import tasks from '../../assets/data/tasks';

const maxLength = 200;

class TaskForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: props.project,
            showTaskForm: false,
            nameCharsRemaining: maxLength,
            descriptionCharsRemaining: maxLength
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
        this.setState({ 
            newTaskName: e.target.value,
            nameCharsRemaining: maxLength - e.target.value.length
        });
    }

    handleNewTaskDescriptionChange(e) {
        this.setState({ 
            newTaskDescription: e.target.value,
            descriptionCharsRemaining: maxLength - e.target.value.length
        });
    }

    handleTaskSubmit() {
        // this is where insert task call to server will go
        if(!this.state.newTaskName || !this.state.newTaskDescription) {
            alert("All fields are required");
            return;
        }
        let task = {
            id: tasks[tasks.length - 1].id + 1,
            projectId: this.state.project.id,
            name: this.state.newTaskName,
            description: this.state.newTaskDescription
        }
        // alert(task.id + " " + task.projectId + " " + task.name + " " + task.description);
        let _project = {...this.state.project};
        _project.tasks.push(task);
        this.setState({
            project: _project,
            showTaskForm: false
        });
        this.setState({
            newTaskName: "",
            newTaskDescription: "",
            nameCharsRemaining: maxLength,
            descriptionCharsRemaining: maxLength
        })
        this.props.renderParent();
    }

    handleTaskCancel() {
        this.setState({ 
            showTaskForm: false,
            newTaskName: null,
            newTaskDescription: null,
            nameCharsRemaining: maxLength,
            descriptionCharsRemaining: maxLength
        });
    }

    render() {
        let title;
        if(this.props.new) {
            title = `New task for ${this.state.project.name}`;
        }
        if(this.props.task) {
            title = `Editing task ${this.props.task.name}`;
        }
        
        return (
            <Col xs={12} md={{ span: 2, offset: 5 }} className="mb-3 text-center">
                <Button onClick={this.showTaskForm}><FontAwesomeIcon icon={faPlusSquare} /> New Task</Button>
                <Modal show={this.state.showTaskForm}>
                    <Modal.Header>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Task name</Form.Label>
                            <Form.Control as="textarea" maxLength={maxLength} rows={4} value={this.state.newTaskName} onChange={this.handleNewTaskNameChange}></Form.Control>
                            <small className="text-muted">{this.state.nameCharsRemaining} characters remaining</small>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" maxLength={maxLength} rows={4} value={this.state.newTaskDescription} onChange={this.handleNewTaskDescriptionChange} />
                            <small className="text-muted">{this.state.descriptionCharsRemaining} characters remaining</small>
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