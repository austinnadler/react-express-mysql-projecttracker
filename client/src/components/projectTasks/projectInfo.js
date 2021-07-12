import React from "react";
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Axios from "axios";

const maxLength = 200;

class ProjectInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {},
            _project: {},
            editProject: false,
            nameCharsRemaining: maxLength,
            descriptionCharsRemaining: maxLength
        }
        this.showProjectEditModal = this.showProjectEditModal.bind(this);
        this.hideProjectEditModal = this.hideProjectEditModal.bind(this);
        this.handleProjectSubmit = this.handleProjectSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    }

    componentDidMount() {
        this.getProject();
        
    }

    getProject() {
        var _project = {};
        Axios.get(`http://localhost:3001/project/${this.props.projectId}`).then(response => {
            _project = { ...response.data[0] };
            this.setState({ project: _project });
            document.title = _project.name;
        });
    }

    showProjectEditModal() {
        this.setState({
            _project: { ...this.state.project }, // _project is used in the change methods of the fields in the modal
            nameCharsRemaining: maxLength - this.state.project.name.length,
            descriptionCharsRemaining: maxLength - this.state.project.description.length
        });
        this.setState({ editProject: true });
    }

    hideProjectEditModal() {
        this.setState({ editProject: false });
    }

    handleNameChange(e) {
        var _p = this.state._project;
        _p.name = e.target.value;
        this.setState({
            _project: _p,
            nameCharsRemaining: maxLength - _p.name.length
        });
    }

    handleDescriptionChange(e) {
        var _p = this.state._project;
        _p.description = e.target.value;
        this.setState({
            _project: _p,
            descriptionCharsRemaining: maxLength - _p.description.length
        });

    }

    handleProjectSubmit(e) {
        e.preventDefault();
        if (this.state._project.name === "" || this.state._project.description === "") {
            alert("All fields are required");
            return;
        }
        Axios.put(`http://localhost:3001/updateProject/${this.props.projectId}`,
        { name: this.state._project.name, description: this.state._project.description }).then(
            (response) => {
                this.setState({
                    project: this.state._project,
                    editProject: false,
                    showAlert: true
                });
            }
        );
        document.title = this.state.project.name;
    }

    render() {
        return (
            <Col xs={12}>
                <Col xs={12} md={{ span: 6, offset: 3 }} className="mt-2 mb-2">
                    <Modal show={this.state.editProject}>
                        <Modal.Header>
                            <Modal.Title>Edit <i>{this.state.project.name}</i></Modal.Title>
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
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="mb-2 mr-2" variant="primary" onClick={this.handleProjectSubmit}>Submit</Button>
                            <Button className="mb-2" variant="secondary" onClick={this.hideProjectEditModal}>Cancel</Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
                <Col xs={12}>
                    <h1 className="m-4 text-success text-center">
                        {this.state.project.name}
                        <Button className="ml-1" onClick={this.showProjectEditModal}><FontAwesomeIcon icon={faPencilAlt} /></Button>
                    </h1>
                </Col>
                <Col xs={12} md={{ span: 6, offset: 3 }} className="col-6 col-offset-3">
                    <p><b>Description:</b> {this.state.project.description}</p>
                </Col>
            </Col>
        );
    }
}
export default ProjectInfo;