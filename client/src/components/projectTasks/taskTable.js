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
import Axios from "axios";

const maxLength = 200;

class TaskTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [], // sort ascening
            showTaskModal: false,
            nameCharsRemaining: maxLength,
            descriptionCharsRemaining: maxLength,
            editingTask: false,
            _task: {}
        }
        this.showTaskModal = this.showTaskModal.bind(this);
        this.handleTaskSubmit = this.handleTaskSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
        this.hideTaskModal = this.hideTaskModal.bind(this);
    }

    componentDidMount() {
        this.getStates();
        this.getTasks();
    }

    getStates = async () => {
        let res = await Axios.get("http://localhost:3001/states");
        this.setState({ states: [...res.data] });
    }

    getTasks() {
        Axios.get(`http://localhost:3001/projectTasks/${this.props.projectId}`).then(response => {
            this.setState({ tasks: response.data });
        });
    }

    handleDelete(tid) {
        var _tasks = [...this.state.tasks];
        Axios.delete(`http://localhost:3001/deleteTask/${tid}`).then(response => {
            _tasks = this.state.tasks.filter(t => t.id !== tid);
            this.setState({ tasks: _tasks });
        });
    }

    showTaskModal(task, e) {
        if (e) { e.stopPropagation(); }
        this.setState({ showTaskModal: true });
        if (task) {
            this.setState({
                editingTask: true,
                taskNameBeforeEdit: task.name,
                _task: task,
                nameCharsRemaining: maxLength - task.name.length,
                descriptionCharsRemaining: maxLength - task.description.length,
            });
        }
    }

    hideTaskModal() {
        this.setState({
            showTaskModal: false,
            editingTask: false,
            taskNameBeforeEdit: null,
            _task: {},
            nameCharsRemaining: maxLength,
            descriptionCharsRemaining: maxLength
        });
    }

    handleNameChange(e) {
        let _task = { ...this.state._task };
        _task.name = e.target.value;
        this.setState({
            _task: _task,
            nameCharsRemaining: maxLength - e.target.value.length
        });
    }

    handleDescriptionChange(e) {
        let _task = { ...this.state._task };
        _task.description = e.target.value;;
        this.setState({
            _task: _task,
            descriptionCharsRemaining: maxLength - e.target.value.length
        });
    }

    handleStateChange(e) {
        let _task = {...this.state._task};
        _task.state = e.target.value;
        _task.state_display = this.getStateDisplayValue(_task);
        this.setState({ _task: _task });
    }

    getStateDisplayValue(t) {
        for(var i = 0; i < this.state.states.length; i++) {
            var s = this.state.states[i];
            //eslint-disable-next-line
            if(s.value == t.state) {
                return s.display_value;
            }
        }
    }

    handleTaskSubmit() {
        if (!this.state._task.name || !this.state._task.description) {
            alert("All fields are required");
            return;
        }
        if (this.state.editingTask) {
            Axios.put(`http://localhost:3001/updateTask/${this.state._task.id}`,
            {
                name: this.state._task.name,
                description: this.state._task.description,
                state: this.state._task.state
            }).then(() => {
                this.getTasks();
            });
        } else {
            Axios.post(`http://localhost:3001/createTask/${this.props.projectId}`,
                {
                    name: this.state._task.name,
                    description: this.state._task.description
                }).then(() => {
                    this.getTasks();
                });
        }
        this.setState({
            showTaskModal: false,
            editingTask: false,
            _task: {},
            nameCharsRemaining: maxLength,
            descriptionCharsRemaining: maxLength
        });
    }

    render() {
        let taskModalTitle = "";
        let stateSelect;
        if (this.state.editingTask) {
            taskModalTitle = <div>Editing task <i>{this.state.taskNameBeforeEdit}</i></div>
            stateSelect = 
            <Form.Group>
                <Form.Label>State</Form.Label>
                <Form.Control className="select" as="select" value={this.state._task.state} onChange={this.handleStateChange}>
                    {
                        this.state.states.map((s) => {
                            return(<option value={s.value} key={s.value}>{s.display_value}</option>)
                        })
                    }
                </Form.Control>
            </Form.Group>
        } else {
            taskModalTitle = <div>New task</div>
        }

        var table;
        if (this.state.tasks.length === 0) {
            table = <h4 className="text-center">This project has no tasks.</h4>
        } else {
            table =
                <Table striped responsive>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>State</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.tasks.map((t) => {
                                return (
                                    <tr key={t.id}>
                                        <td>{t.name}</td>
                                        <td>{t.description}</td>
                                        <td>{t.state_display}</td>
                                        <td className="text-center">
                                            <OverlayTrigger placement="top" delay={{ hide: 100 }} overlay={<Tooltip>Edit this task</Tooltip>}>
                                                <Button variant="primary" onClick={(e) => this.showTaskModal(t, e)}><FontAwesomeIcon icon={faEdit} /></Button>
                                            </OverlayTrigger>
                                        </td>
                                        <td className="text-center">
                                            <OverlayTrigger placement="top" delay={{ hide: 100 }} overlay={<Tooltip>Delete this task</Tooltip>}>
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
                <Col xs={12} md={{ span: 4, offset: 4 }} className="mb-3 text-center">
                    <Button onClick={() => this.showTaskModal(null)}><FontAwesomeIcon icon={faPlusSquare} /> New Task</Button>
                    <Modal show={this.state.showTaskModal}>
                        <Modal.Header>
                            <Modal.Title>{taskModalTitle}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group>
                                <Form.Label>Task name</Form.Label>
                                <Form.Control as="textarea" maxLength={maxLength} rows={4} value={this.state._task.name} onChange={this.handleNameChange}></Form.Control>
                                <small className="text-muted">{this.state.nameCharsRemaining} characters remaining</small>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" maxLength={maxLength} rows={4} value={this.state._task.description} onChange={this.handleDescriptionChange} />
                                <small className="text-muted">{this.state.descriptionCharsRemaining} characters remaining</small>
                            </Form.Group>
                            {stateSelect}
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
export default TaskTable;