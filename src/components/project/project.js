import React from 'react';
import './project.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import projects from '../../assets/data/projects';
import tasks from '../../assets/data/tasks';

class Project extends React.Component {
    constructor(props) {
        super(props);
        const pid = this.props.match.params.pid;
        var p = projects.find(p => p.id === parseInt(pid));
        p.tasks = tasks.filter(t => t.projectId === parseInt(pid));
        this.state = {
            project: p
        };
        // methods that are called without () must be bound
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
    }

    componentDidMount() {
        // this is where the select call to the server will go
        document.title = this.state.project.name;
        var table;
        if (this.state.project.tasks.length == 0) {
            table = <h4 className="text-center">{this.state.project.name} has no tasks.</h4>
        } else {
            table = <Table bordered responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>State</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.project.tasks.map((t) => {
                            return (
                                <tr key={t.id}>
                                    <td>{t.name}</td>
                                    <td>{t.description}</td>
                                    <td>{t.state}</td>
                                    <td className="text-center">
                                        <Button variant="success"><FontAwesomeIcon icon={faPencilAlt} /></Button>
                                    </td>
                                    <td className="text-center">
                                        <Button variant="danger"><FontAwesomeIcon icon={faTrash} /></Button>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        }
        this.setState({ table: table });
    }

    toggleEdit(toggleTo) {
        if (toggleTo) {
            this.setState({
                _project: this.state.project
            });
        }
        if (!toggleTo) {
            this.setState({
                project: this.state._project
            });
        }
        this.setState({ edit: toggleTo });
    }

    handleNameChange(e) {
        var _project = { ...this.state.project };
        _project.name = e.target.value;
        this.setState({ project: _project });
    }

    handleDescriptionChange(e) {
        var _project = { ...this.state.project };
        _project.description = e.target.value;
        this.setState({ project: _project });
    }

    handleSubmit(e) {
        // This is where the update call to server will go
        e.preventDefault();
        this.setState({
            edit: false,
            showAlert: true
        });
        document.title = this.state.project.name;
    }

    closeAlert() {
        this.setState({
            showAlert: false
        });
    }

    render() {
        var alert;
        if (this.state.showAlert) {
            alert = <Alert show={this.state.showAlert} variant="success" className="m-4" onClose={this.closeAlert} dismissible>
                <Alert.Heading>Project updated.</Alert.Heading>
                <hr />
                <b>Name:</b>
                <div>{this.state.project.name}</div>
                <b>Description:</b>
                <div>{this.state.project.description}</div>
            </Alert>;
        }
        var topSection;
        if (this.state.edit) {
            topSection = (
                <Col xs={12} md={{ span: 6, offset: 3 }} className="mt-2 mb-2">
                    <Form onSubmit={this.handleSubmit} >
                        <Form.Group>
                            <Form.Label>Project name</Form.Label>
                            <Form.Control type="text" maxLength="200" value={this.state.project.name} onChange={this.handleNameChange}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} value={this.state.project.description} onChange={this.handleDescriptionChange} />
                        </Form.Group>
                        <Button className="mb-2 mr-2" variant="success" type="submit">Submit</Button>
                        <Button className="mb-2" variant="danger" onClick={() => this.toggleEdit(false)}>Cancel</Button>
                    </Form>
                </Col>
            )
        } else {
            topSection = (
                <Col xs={12}>
                    <Col xs={12}>
                        <h1 className="m-4 text-success text-center">
                            {this.state.project.name}
                            <Button className="ml-1" onClick={() => this.toggleEdit(true)}><FontAwesomeIcon icon={faPencilAlt} /></Button>
                        </h1>
                    </Col>
                    <Col xs={12} md={{ span: 6, offset: 3 }} className="col-6 col-offset-3">
                        <p><b>Description:</b> {this.state.project.description}</p>
                    </Col>
                </Col>
            )
        }
        return (
            <Container>
                <Row>
                    {alert}
                    {topSection}
                    <Col xs={12}>
                        {this.state.table}
                    </Col>
                </Row>
            </Container >
        )
    };
}
export default Project;