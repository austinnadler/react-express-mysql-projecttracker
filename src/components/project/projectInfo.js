import React from "react";
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { faPencilAlt, faTrash, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ProjectInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: props.project
        }
        this.showProjectEditForm = this.showProjectEditForm.bind(this);
        this.hideProjectEditForm = this.hideProjectEditForm.bind(this);
        this.handleProjectSubmit = this.handleProjectSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    }

    showProjectEditForm() {
        this.setState({
            _project: this.state.project // _project is used in the change methods of the fields in the modal
        });
        this.setState({ editProject: true });
    }

    hideProjectEditForm() {
        this.setState({ editProject: false });
    }

    handleNameChange(e) {
        var _p = this.state._project;
        _p.name = e.target.value;
        this.setState({ _project: _p })
        // this.setState({ project: _project });
    }

    handleDescriptionChange(e) {
        var _p = this.state._project;
        _p.description = e.target.value;
        this.setState({ _project: _p })
        // this.setState({ project: _project });
    }

    handleProjectSubmit(e) {
        // This is where the update call to server will go
        e.preventDefault();
        if(this.state._project.name === "" || this.state._project.description === "") {
            alert("All fields are required");
            return;
        }
        this.setState({
            editProject: false,
            showAlert: true
        });
        document.title = this.state.project.name;
    }
    
    render() {
        var info;
        if (this.state.editProject) {
            info =
                <Col xs={12} md={{ span: 6, offset: 3 }} className="mt-2 mb-2">
                    <Form onSubmit={this.handleProjectSubmit} >
                        <Form.Group>
                            <Form.Label>Project name</Form.Label>
                            <Form.Control type="text" maxLength="200" value={this.state.project.name} onChange={this.handleNameChange}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} value={this.state.project.description} onChange={this.handleDescriptionChange} />
                        </Form.Group>
                        <Button className="mb-2 mr-2" variant="success" type="submit">Submit</Button>
                        <Button className="mb-2" variant="danger" onClick={this.hideProjectEditForm}>Cancel</Button>
                    </Form>
                </Col>
        } else {
            info =
                <Col xs={12}>
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
        }
        return info;
    }
}
export default ProjectInfo;