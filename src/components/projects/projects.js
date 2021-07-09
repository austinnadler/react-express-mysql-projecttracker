import React from 'react';
import './projects.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
// import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TitleBar from '../titlebar/titlebar';
import projects from '../../assets/data/projects';

class Projects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: projects
        };
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        document.title = "Projects";
    }

    goTo(id) {
        this.props.history.push(`/project/${id}`);
    }

    handleDelete(e) {
        e.stopPropagation();
    }


    render() {
        return (
            <Container>
                <TitleBar title="Projects" textColor="success" />
                <Row>
                    {
                        this.state.projects.map((p) => {
                            return (
                                <Col md={4} className="p-1" onMouseDown={() => this.goTo(p.id)}>
                                    <div className="inner shadow p-3">
                                        <Row>
                                            <Col xs={9}><h4>{p.name}</h4></Col>
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
                                                    <Button size="sm" variant="danger" className="float-right" onMouseDown={this.handleDelete}><FontAwesomeIcon icon={faTrash} /></Button>
                                                </OverlayTrigger>
                                            </Col>
                                        </Row>
                                        <div>{p.description}</div>
                                    </div>
                                </Col>

                            )
                        })
                    }
                </Row>
                {/* <Table bordered responsive>
                    <thead>
                        <tr>
                            <th>View</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Area</th>
                            <th>Manager</th>
                            <th>State</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.projects.map((p) => {
                                return (
                                    <tr key={p.id}>
                                        <td>
                                            <Button onClick={() => this.goTo(p.id)} size="sm"><FontAwesomeIcon icon={faEye}/></Button>
                                        </td>
                                        <td>{p.name}</td>
                                        <td>{p.description}</td>
                                        <td>{p.area}</td>
                                        <td>{p.manager}</td>
                                        <td>{p.state}</td>
                                        <td>
                                            <Button variant="danger"><FontAwesomeIcon icon={faTrash}/></Button>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table> */}
            </Container>
        )
    };
}
export default Projects;