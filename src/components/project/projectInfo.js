import React from "react";
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const maxLength = 200;

class ProjectInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: props.project,
            _project: {},
            editProject: false,
            nameCharsRemaining: maxLength,
            descriptionCharsRemaining: maxLength
        }
        this.showProjectEditForm = this.showProjectEditForm.bind(this);
        this.hideProjectEditForm = this.hideProjectEditForm.bind(this);
        this.handleProjectSubmit = this.handleProjectSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    }

    componentDidMount() {
        document.title = this.state.project.name;
    }

    showProjectEditForm() {
        this.setState({
            _project: { ...this.state.project }, // _project is used in the change methods of the fields in the modal
            nameCharsRemaining: maxLength - this.state.project.name.length,
            descriptionCharsRemaining: maxLength - this.state.project.description.length
        });
        this.setState({ editProject: true });
    }

    hideProjectEditForm() {
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
        // This is where the update call to server will go
        e.preventDefault();
        if (this.state._project.name === "" || this.state._project.description === "") {
            alert("All fields are required");
            return;
        }
        this.setState({
            project: { ...this.state._project },
            editProject: false,
            showAlert: true
        });
        document.title = this.state.project.name;
    }

    render() {
        return (
            <Col xs={12}>
                <Col xs={12} md={{ span: 6, offset: 3 }} className="mt-2 mb-2">
                    <Modal show={this.state.editProject}>
                        <Modal.Header>
                            Edit {this.state.project.name}
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
                            <Button className="mb-2" variant="secondary" onClick={this.hideProjectEditForm}>Cancel</Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
                <Col xs={12}>
                    <h1 className="m-4 text-success text-center">
                        {this.state.project.name}
                        <Button className="ml-1" onClick={this.showProjectEditForm}><FontAwesomeIcon icon={faPencilAlt} /></Button>
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