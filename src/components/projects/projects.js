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
import projects from '../../assets/data/projects';
import tasks from '../../assets/data/tasks';

const maxLength = 200;

class Projects extends React.Component {
    constructor(props) {
        super(props);
        projects.forEach(p => {
            p.tasks = tasks.filter(t => t.projectId === p.id);
        });
        let _projects = projects.sort((a, b) => { return a.id - b.id }); // sort ascending
        this.state = {
            projects: _projects,
            showDeleteModal: false,
            projectToDelete: {},
            editingProject: null,
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
    }

    goTo(id, e) {
        if (e.button === 2) return; // dont do anything on right click
        this.props.history.push(`/tasks/${id}`);
    }

    handleDeleteConfirm(p, e) {
        e.stopPropagation();
        this.setState({
            projectToDelete: p,
            showDeleteModal: true
        });
    }

    handleDelete(pid) {
        let _projects = this.state.projects.filter(p => p.id !== pid)
        this.setState({
            projects: _projects,
            showDeleteModal: false
        });
    }

    handleDeleteCancel() {
        this.setState({ showDeleteModal: false });
    }

    handleNameChange(e) {
        let name = e.target.value;
        this.setState({
            newProjectName: name,
            nameCharsRemaining: maxLength - name.length
        });
    }

    handleDescriptionChange(e) {
        let description = e.target.value;
        this.setState({
            newProjectDescription: description,
            descriptionCharsRemaining: maxLength - description.length
        });
    }

    showProjectModal(project, e) {
        this.setState({ showProjectModal: true });
        if (e) {
            e.stopPropagation();
        }
        if (project) {
            this.setState({
                editingProject: project,
                newProjectId: project.id,
                newProjectName: project.name,
                newProjectDescription: project.description,
                nameCharsRemaining: maxLength - project.name.length,
                descriptionCharsRemaining: maxLength - project.description.length,
            });
        }
    }

    hideProjectModal() {
        this.setState({
            showProjectModal: false,
            editingProject: null,
            newProjectId: null,
            newProjectName: null,
            newProjectDescription: null,
            nameCharsRemaining: maxLength,
            descriptionCharsRemaining: maxLength
        });
    }

    handleProjectSubmit() {
        if (!this.state.newProjectName || !this.state.newProjectDescription) {
            alert("All fields are required");
            return;
        }
        let _projects = [...this.state.projects];
        if (this.state.newProjectId) {
            _projects.forEach(p => {
                if (p.id === this.state.newProjectId) {
                    p.name = this.state.newProjectName;
                    p.description = this.state.newProjectDescription;
                }
            });
        } else {
            _projects.push({
                id: this.state.projects[this.state.projects.length - 1].id + 1,
                name: this.state.newProjectName,
                description: this.state.newProjectDescription,
                tasks: []
            });
        }
        this.setState({
            projects: _projects,
            showProjectModal: false,
            editingProject: null,
            newProjectId: null,
            newProjectName: null,
            newProjectDescription: null,
            nameCharsRemaining: maxLength,
            descriptionCharsRemaining: maxLength
        });
    }

    render() {
        var projectModalTitle;
        if(this.state.editingProject) {
            projectModalTitle = <Modal.Title>Editing project&nbsp;<i>{this.state.editingProject.name}</i></Modal.Title>
        } else {
            projectModalTitle = <Modal.Title>New project</Modal.Title>;
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
                        {projectModalTitle}
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Project name</Form.Label>
                            <Form.Control as="textarea" maxLength={maxLength} rows={4} value={this.state.newProjectName} onChange={this.handleNameChange}></Form.Control>
                            <small className="text-muted">{this.state.nameCharsRemaining} characters remaining</small>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" maxLength={maxLength} rows={4} value={this.state.newProjectDescription} onChange={this.handleDescriptionChange} />
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
                                <Col md={4} className="p-1" onMouseDown={(e) => this.goTo(p.id, e)}>
                                    <div className="inner shadow p-3">
                                        <Row>
                                            <Col xs={10}>
                                                <h4 className="d-inline-block mb-0">{p.name}</h4>
                                            </Col>
                                            <Col xs={1}>
                                                <OverlayTrigger placement="top" delay={{ hide: 100 }}
                                                    overlay={
                                                        <Tooltip>
                                                            Edit this project
                                                        </Tooltip>
                                                    }
                                                >
                                                    <Button size="sm" variant="primary" className="float-right" onMouseDown={(e) => this.showProjectModal(p, e)}><FontAwesomeIcon icon={faEdit} /></Button>
                                                </OverlayTrigger>
                                            </Col>
                                            <Col xs={1}>
                                                <OverlayTrigger
                                                    placement="top"
                                                    delay={{ hide: 100 }}
                                                    overlay={
                                                        <Tooltip>
                                                            Delete this project
                                                        </Tooltip>
                                                    }
                                                >
                                                    <Button size="sm" variant="danger" className="float-right" onMouseDown={(e) => this.handleDeleteConfirm(p, e)}><FontAwesomeIcon icon={faTrash} /></Button>
                                                </OverlayTrigger>
                                            </Col>
                                            <Col xs={12}>
                                                <small className={"text-muted " + (p.tasks.length === 0 ? "d-none" : "")}>{p.tasks.length} tasks</small>
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