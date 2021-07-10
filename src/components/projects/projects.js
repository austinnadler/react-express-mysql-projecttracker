import React from 'react';
import './projects.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import projects from '../../assets/data/projects';
import tasks from '../../assets/data/tasks';

class Projects extends React.Component {
    constructor(props) {
        super(props);
        projects.forEach(p => {
            p.tasks = tasks.filter(t => t.projectId === p.id);
        });
        let _projects = projects.sort((a, b) => { return a.id - b.id }); // sort ascending
        this.state = {
            projects: _projects,
            showModal: false,
            projectToDelete: {}
        }
        this.handleDelete = this.handleDelete.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {
        document.title = "Projects";
    }

    goTo(id, e) {
        if(e.button === 2) return; // dont do anything on right click
        this.props.history.push(`/project/${id}`);
    }

    handleDeleteConfirm(p, e) {
        this.setState({ 
            projectToDelete: p,
            showModal: true
        });
        e.stopPropagation();
    }

    handleDelete(pid) {
        let _projects = this.state.projects.filter(p => p.id !== pid)
        this.setState({ 
            projects: _projects,
            showModal: false
        });
    }

    handleCancel() {
        this.setState({ showModal: false });
    }

    render() {
        return (
            <Container>
                <Modal show={this.state.showModal}>
                    <Modal.Header>
                        <Modal.Title>Delete {this.state.projectToDelete.name}?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete {this.state.projectToDelete.name}?<br/>Doing so will also delete all of its tasks.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => this.handleDelete(this.state.projectToDelete.id)}>
                            Delete
                        </Button>
                        <Button variant="secondary" onClick={this.handleCancel}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Col xs={12} className="mt-3 mb-3 text-center">
                    <h1 className="text-success">Projects</h1>
                </Col>
                <Row>
                    {
                        this.state.projects.map((p) => {
                            return (
                                <Col md={4} className="p-1" onMouseDown={(e) => this.goTo(p.id, e)}>
                                    <div className="inner shadow p-3">
                                        <Row>
                                            <Col xs={9}>
                                                <h4 className="d-inline-block mb-0">{p.name}</h4>
                                            </Col>
                                            <Col xs={3}>
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
    };
}
export default Projects;