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

const maxLength = 200;

class Projects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            showDeleteModal: false,
            projectToDelete: {}, // Modal is always rendered, so give this an empty object instead of null to prevent errors
            newProject: {},
            editingProject: false,
            nameCharsRemaining: maxLength,
            descriptionCharsRemaining: maxLength
        }
        this.handleDelete = this.handleDelete.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleDeleteCancel = this.handleDeleteCancel.bind(this);
        this.showProjectModal = this.showProjectModal.bind(this);
        this.hideProjectModal = this.hideProjectModal.bind(this);
        this.handleProjectSubmit = this.handleProjectSubmit.bind(this);
    }

    componentDidMount() {
        document.title = "Projects";
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

    goTo(id, e) {
        if (e.button === 2) return; // dont do anything on right click
        this.props.history.push(`/tasks/${id}`);
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
                newProject: project,
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
            newProject: {},
            nameCharsRemaining: maxLength,
            descriptionCharsRemaining: maxLength
        });
    }

    handleNameChange(e) {
        let newProject = { ...this.state.newProject };
        newProject.name = e.target.value;
        this.setState({
            newProject: newProject,
            nameCharsRemaining: maxLength - e.target.value.length
        });
    }

    handleDescriptionChange(e) {
        let newProject = { ...this.state.newProject };
        newProject.description = e.target.value;
        this.setState({
            newProject: newProject,
            descriptionCharsRemaining: maxLength - e.target.value.length
        });
    }

    handleProjectSubmit() {
        if (!this.state.newProject.name || !this.state.newProject.description) {
            alert("All fields are required");
            return;
        }
        if (this.state.editingProject) {
            Axios.put(`http://localhost:3001/updateProject/${this.state.newProject.id}`,
            { 
                name: this.state.newProject.name,
                description: this.state.newProject.description 
            }).then(() => {
                this.getProjects();
            });
        } else {
            Axios.post("http://localhost:3001/insertProject",
            {
                name: this.state.newProject.name,
                description: this.state.newProject.description,
            }).then(() => {
                this.getProjects();
            });
        }
        this.setState({
            showProjectModal: false,
            editingProject: false,
            newProject: {},
            nameCharsRemaining: maxLength,
            descriptionCharsRemaining: maxLength
        });
    }

    render() {
        var projectModalTitle;
        if (this.state.editingProject) {
            projectModalTitle = <div>Editing project&nbsp;<i>{this.state.projectNameBeforeEdit}</i></div>
        } else {
            projectModalTitle = "New project";
        }
        return (
            <Container>
                <Modal show={this.state.showDeleteModal}>
                    <Modal.Header>
                        <Modal.Title>Delete {this.state.projectToDelete.name}?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete {this.state.projectToDelete.name}?<br />Doing so will also delete all of its tasks.</Modal.Body>
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
                            <Form.Control as="textarea" maxLength={maxLength} rows={4} value={this.state.newProject.name} onChange={this.handleNameChange}></Form.Control>
                            <small className="text-muted">{this.state.nameCharsRemaining} characters remaining</small>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" maxLength={maxLength} rows={4} value={this.state.newProject.description} onChange={this.handleDescriptionChange} />
                            <small className="text-muted">{this.state.descriptionCharsRemaining} characters remaining</small>
                        </Form.Group>
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
                                                <small className={"text-muted " + (p.numTasks === 0 ? "d-none" : "")}>{p.numTasks} tasks</small>
                                            </Col>
                                        </Row>
                                        <div>{p.description}</div>
                                    </div>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Container>
        )
    }
}
export default Projects;