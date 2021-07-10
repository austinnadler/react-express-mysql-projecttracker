import React from "react";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { faTrash, faPlusSquare, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import tasks from '../../assets/data/tasks';

const maxLength = 200;

class ProjectTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTaskModal: false,
            nameCharsRemaining: maxLength,
            descriptionCharsRemaining: maxLength,
            editingTask: null
        }
        // this.renderMe = this.renderMe.bind(this);
        this.showTaskModal = this.showTaskModal.bind(this);
        this.handleTaskSubmit = this.handleTaskSubmit.bind(this);
        this.handleNewTaskNameChange = this.handleNewTaskNameChange.bind(this);
        this.handleNewTaskDescriptionChange = this.handleNewTaskDescriptionChange.bind(this);
        this.hideTaskModal = this.hideTaskModal.bind(this);
    }

    handleDelete(tid) {
        var _project = { ...this.props.project };
        _project.tasks = _project.tasks.filter(t => t.id !== tid);
        this.setState({ project: _project });
    }

    showTaskModal(task, e) {
        this.setState({
            showTaskModal: true,
            editingTask: task
        });
        if (e) {
            e.stopPropagation();
        }
        if (task) {
            this.setState({
                newTaskId: task.id,
                newTaskName: task.name,
                newTaskDescription: task.description,
                nameCharsRemaining: maxLength - task.name.length,
                descriptionCharsRemaining: maxLength - task.description.length,
            });
        }
    }

    hideTaskModal() {
        this.setState({
            showTaskModal: false,
            editingTask: null,
            newTaskName: null,
            newTaskDescription: null,
            nameCharsRemaining: maxLength,
            descriptionCharsRemaining: maxLength
        });
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
        if (!this.state.newTaskName || !this.state.newTaskDescription) {
            alert("All fields are required");
            return;
        }
        if(this.state.newTaskId) {
            let _tasks = [...tasks];
            _tasks.forEach(t => {
                if(t.id === this.state.newTaskId) {
                    t.name = this.state.newTaskName;
                    t.description = this.state.newTaskDescription;
                }
            });
        } else {
            let task = {
                id: tasks[tasks.length - 1].id + 1,
                projectId: this.props.project.id,
                name: this.state.newTaskName,
                description: this.state.newTaskDescription
            }
            // alert(task.id + " " + task.projectId + " " + task.name + " " + task.description);
            let _project = { ...this.props.project };
            _project.tasks.push(task);
            this.setState({
                project: _project
            });
        }
        this.setState({
            showTaskModal: false,
            newTaskName: "",
            newTaskDescription: "",
            nameCharsRemaining: maxLength,
            descriptionCharsRemaining: maxLength
        });
    }

    render() {
        let modalTitle;
        if(this.state.editingTask) {
            modalTitle = `Editing task ${this.state.editingTask.name}`;
        } else {
            modalTitle = `New task for ${this.props.project.name}`;
        }

        var table;
        if (this.props.project.tasks.length === 0) {
            table = <h4 className="text-center">{this.props.project.name} has no tasks.</h4>
        } else {
            table =
                <Table striped responsive>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.project.tasks.map((t) => {
                                return (
                                    <tr key={t.id}>
                                        <td>{t.name}</td>
                                        <td>{t.description}</td>
                                        <td className="text-center">
                                            <OverlayTrigger
                                                placement="top"
                                                delay={{ hide: 100 }}
                                                overlay={
                                                    <Tooltip>
                                                        Delete this task
                                                    </Tooltip>
                                                }
                                            >
                                                <Button variant="primary" onClick={(e) => this.showTaskModal(t, e)}><FontAwesomeIcon icon={faEdit} /></Button>
                                            </OverlayTrigger>
                                        </td>
                                        <td className="text-center">
                                            <OverlayTrigger
                                                placement="top"
                                                delay={{ hide: 100 }}
                                                overlay={
                                                    <Tooltip>
                                                        Delete this task
                                                    </Tooltip>
                                                }
                                            >
                                                <Button variant="danger" onClick={() => this.handleDelete(t.id)}><FontAwesomeIcon icon={faTrash} /></Button>
                                            </OverlayTrigger>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
        }
        return (
            <Col xs={12}>
                {/* <TaskForm project={this.props.project} new={true} renderParent={this.renderMe}/> */}
                <Col xs={12} md={{ span: 4, offset: 4 }} className="mb-3 text-center">
                    <Button onClick={() => this.showTaskModal(null)}><FontAwesomeIcon icon={faPlusSquare} /> New Task</Button>
                    <Modal show={this.state.showTaskModal}>
                        <Modal.Header>
                            <Modal.Title>{modalTitle}</Modal.Title>
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
                            <Button variant="secondary" onClick={this.hideTaskModal}>
                                Cancel
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
                {table}
            </Col>
        )
    }
}
export default ProjectTable;