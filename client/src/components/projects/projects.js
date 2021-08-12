import React from 'react';
import './projects.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { faTrash, faPlusSquare, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Axios from 'axios';
import TimeStamp from '../timestamp/timestamp';

const maxLength = 200;

class Projects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            states: [],
            showDeleteModal: false,
            projectToDelete: {}, // Modal is always "rendered", so give this an empty object instead of null to prevent errors
            _project: {}, // temp variable to store a copy of the project being created or updated
            editingProject: false,
            nameCharsRemaining: maxLength,
            descriptionCharsRemaining: maxLength
        }
        this.handleDelete = this.handleDelete.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
        this.handleDeleteCancel = this.handleDeleteCancel.bind(this);
        this.showProjectModal = this.showProjectModal.bind(this);
        this.hideProjectModal = this.hideProjectModal.bind(this);
        this.handleProjectSubmit = this.handleProjectSubmit.bind(this);
    }

    componentDidMount() {
        document.title = "Projects";
        this.getStates();
        this.getProjects();
    }

    getProjects() {
        let _projects = [];
        Axios.get("http://localhost:3001/projects").then(response => {
            _projects = [...response.data];
            _projects.forEach(p => {
                Axios.get(`http://localhost:3001/numProjectTasks/${p.id}`).then(response => {
                    p.numTasks = response.data[0].numTasks;
                    this.setState({ projects: _projects });
                });
            });
        });
    }

    getStates = async () => {
        let res = await Axios.get("http://localhost:3001/states");
        this.setState({ states: [...res.data] });
    }

    goTo(id, e) {
        if (e.button === 0) this.props.history.push(`/tasks/${id}`);
    }

    handleDelete(pid) {
        Axios.delete(`http://localhost:3001/deleteProject/${pid}`).then(response => {
            this.setState({
                projects: this.state.projects.filter(p => p.id !== pid),
                showDeleteModal: false
            });
        });
    }

    handleDeleteConfirm(p, e) {
        e.stopPropagation();
        this.setState({
            projectToDelete: p,
            showDeleteModal: true
        });
    }

    handleDeleteCancel() {
        this.setState({ showDeleteModal: false });
    }

    showProjectModal(project, e) {
        if (e) { e.stopPropagation(); }
        this.setState({ showProjectModal: true });
        if (project) {
            this.setState({
                editingProject: true,
                projectNameBeforeEdit: project.name,
                _project: project,
                nameCharsRemaining: maxLength - project.name.length,
                descriptionCharsRemaining: maxLength - project.description.length,
            });
        }
    }

    hideProjectModal() {
        this.setState({
            showProjectModal: false,
            editingProject: false,
            projectNameBeforeEdit: null,
            _project: {},
            nameCharsRemaining: maxLength,
            descriptionCharsRemaining: maxLength
        });
    }

    handleNameChange(e) {
        let _project = { ...this.state._project };
        _project.name = e.target.value;
        this.setState({
            _project: _project,
            nameCharsRemaining: maxLength - e.target.value.length
        });
    }

    handleDescriptionChange(e) {
        let _project = { ...this.state._project };
        _project.description = e.target.value;
        this.setState({
            _project: _project,
            descriptionCharsRemaining: maxLength - e.target.value.length
        });
    }

    handleStateChange(e) {
        let _project = { ...this.state._project };
        _project.state = e.target.value;
        _project.state_display = this.getStateDisplayValue(_project);
        this.setState({ _project: _project });
    }

    getStateDisplayValue(p) {
        for (var i = 0; i < this.state.states.length; i++) {
            var s = this.state.states[i];
            //eslint-disable-next-line
            if (s.value == p.state) {
                return s.display_value;
            }
        }
    }

    handleProjectSubmit = async () => {
        if (!this.state._project.name || !this.state._project.description) {
            alert("All fields are required");
            return;
        }
        if (this.state.editingProject) {
            let _projects = [...this.state.projects];
            await Axios.put(`http://localhost:3001/updateProject/${this.state._project.id}`,
                {
                    name: this.state._project.name,
                    description: this.state._project.description,
                    state: this.state._project.state
                });
            let _p = _projects.find(p => p.id === this.state._project.id);
            _p.name = this.state._project.name;
            _p.description = this.state._project.description;
            _p.state = this.state._project.state;
            _p.state_display = this.state._project.state_display;
            this.setState({ projects: _projects });
            this.getProjects(); // temporary. Project currently hidden when state is changed and they should be moved to the section for their new state
        } else {
            Axios.post("http://localhost:3001/createProject",
                {
                    name: this.state._project.name,
                    description: this.state._project.description
                }).then(() => {
                    this.getProjects(); // New project is being created, need to query the db after inserting to get the id in case the project needs to be edited or deleted immediately
                });
        }
        this.setState({
            showProjectModal: false,
            editingProject: false,
            _project: {},
            nameCharsRemaining: maxLength,
            descriptionCharsRemaining: maxLength
        });
    }

    render() {
        var projectModalTitle;
        var stateSelect;
        if (this.state.editingProject) {
            projectModalTitle = <div>Editing project&nbsp;<i>{this.state.projectNameBeforeEdit}</i></div>
            stateSelect =
                <Form.Group>
                    <Form.Label>State</Form.Label>
                    <Form.Control className="select" as="select" value={this.state._project.state} onChange={this.handleStateChange}>
                        {
                            this.state.states.map((s) => {
                                return (<option value={s.value} key={s.value}>{s.display_value}</option>)
                            })
                        }
                    </Form.Control>
                </Form.Group>
        } else {
            projectModalTitle = "New project";
        }
        return (
            <Container>
                <Modal show={this.state.showDeleteModal}>
                    <Modal.Header>
                        <Modal.Title>Delete {this.state.projectToDelete.name}?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete {this.state.projectToDelete.name}?</p>
                        <p>Doing so will also delete all of its tasks.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => this.handleDelete(this.state.projectToDelete.id)}>
                            Delete
                        </Button>
                        <Button variant="secondary" onClick={this.handleDeleteCancel}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showProjectModal}>
                    <Modal.Header>
                        <Modal.Title>{projectModalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Project name</Form.Label>
                            <Form.Control as="textarea" maxLength={maxLength} rows={4} value={this.state._project.name} onChange={this.handleNameChange}></Form.Control>
                            <small className="text-muted">{this.state.nameCharsRemaining} characters remaining</small>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" maxLength={maxLength} rows={4} value={this.state._project.description} onChange={this.handleDescriptionChange} />
                            <small className="text-muted">{this.state.descriptionCharsRemaining} characters remaining</small>
                        </Form.Group>
                        {stateSelect}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="mb-2 mr-2" variant="primary" onClick={this.handleProjectSubmit}>Submit</Button>
                        <Button className="mb-2" variant="secondary" onClick={this.hideProjectModal}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
                <Col xs={12} className="mt-3 mb-3 text-center">
                    <h1 className="text-success">Projects</h1>
                    <Col xs={12} md={{ span: 4, offset: 4 }} className="mt-3 text-center">
                        <Button onClick={(e) => this.showProjectModal(null)}><FontAwesomeIcon icon={faPlusSquare} /> New Project</Button>
                    </Col>
                </Col>
                <Row>
                    {
                        this.state.states.map((s) => {
                            var stateHeader = <h1 key={s.value}>{s.display_value}</h1>;
                            var projectsInState = this.state.projects.filter((p) => p.state === s.value);
                            if (projectsInState.length === 0) {
                                stateHeader =
                                    <div key={s.value}>
                                        <h1>{s.display_value}</h1>
                                        <p>There are currently no {s.display_value} projects.</p>
                                    </div>;
                            }
                            return (
                                <Col xs={12} className="mb-4">
                                    {stateHeader}
                                    <Row>
                                        {
                                            projectsInState.map((project) => {
                                                let timestamp;
                                                if(!project.updated) {
                                                    timestamp = <TimeStamp datetime={project.created} prefix="Created"></TimeStamp>
                                                } else {
                                                    timestamp = <TimeStamp datetime={project.updated} prefix="Updated"></TimeStamp>
                                                }
                                                return (
                                                    <Col key={project.id} md={4} className="p-1" onMouseDown={(e) => this.goTo(project.id, e)}>
                                                        <div className="inner shadow p-3 position-relative">
                                                            <Row>
                                                                <Col xs={10}>
                                                                    <h4 className="d-inline-block mb-0">{project.name}</h4>
                                                                </Col>
                                                                <Col xs={1}>
                                                                    <OverlayTrigger placement="top" delay={{ hide: 100 }} overlay={<Tooltip>Edit this project</Tooltip>}>
                                                                        <Button size="sm" variant="primary" className="float-right" onMouseDown={(e) => this.showProjectModal(project, e)}><FontAwesomeIcon icon={faEdit} /></Button>
                                                                    </OverlayTrigger>
                                                                </Col>
                                                                <Col xs={1}>
                                                                    <OverlayTrigger placement="top" delay={{ hide: 100 }} overlay={<Tooltip>Delete this project</Tooltip>}>
                                                                        <Button size="sm" variant="danger" className="float-right" onMouseDown={(e) => this.handleDeleteConfirm(project, e)}><FontAwesomeIcon icon={faTrash} /></Button>
                                                                    </OverlayTrigger>
                                                                </Col>
                                                                <Col xs={12}>
                                                                    <small className="text-muted">
                                                                        {project.state_display} - {project.numTasks} tasks
                                                                    </small>
                                                                </Col>
                                                            </Row>
                                                            <div>{project.description}</div>
                                                            <div className="position-absolute bottom-0 end-0 ts">{timestamp}</div>
                                                        </div>
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>
                                </Col>)
                        })
                    }
                    {/* {
                        this.state.projects.map((p) => {
                            return (
                                <Col key={p.id} md={4} className="p-1" onMouseDown={(e) => this.goTo(p.id, e)}>
                                    <div className="inner shadow p-3">
                                        <Row>
                                            <Col xs={10}>
                                                <h4 className="d-inline-block mb-0">{p.name}</h4>
                                            </Col>
                                            <Col xs={1}>
                                                <OverlayTrigger placement="top" delay={{ hide: 100 }} overlay={<Tooltip>Edit this project</Tooltip>}>
                                                    <Button size="sm" variant="primary" className="float-right" onMouseDown={(e) => this.showProjectModal(p, e)}><FontAwesomeIcon icon={faEdit} /></Button>
                                                </OverlayTrigger>
                                            </Col>
                                            <Col xs={1}>
                                                <OverlayTrigger placement="top" delay={{ hide: 100 }} overlay={<Tooltip>Delete this project</Tooltip>}>
                                                    <Button size="sm" variant="danger" className="float-right" onMouseDown={(e) => this.handleDeleteConfirm(p, e)}><FontAwesomeIcon icon={faTrash} /></Button>
                                                </OverlayTrigger>
                                            </Col>
                                            <Col xs={12}>
                                                <small className="text-muted">
                                                    {p.state_display} - {p.numTasks} tasks
                                                </small>
                                            </Col>
                                        </Row>
                                        <div>{p.description}</div>
                                    </div>
                                </Col>
                            )
                        })
                    } */}
                </Row>
            </Container>
        )
    }
}
export default Projects;