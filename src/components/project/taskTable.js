import React from "react";
import TaskForm from "./taskForm";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Table from 'react-bootstrap/Table';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ProjectTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: props.project
        }
        this.renderMe = this.renderMe.bind(this);
    }

    // this method is passed to taskForm to trigger an update when a task is submitted
    renderMe() {
        this.forceUpdate();
    }

    handleDelete(tid) {
        var _project = { ...this.state.project };
        _project.tasks = _project.tasks.filter(t => t.id !== tid);
        this.setState({ project: _project });
    }

    render() {
        var table;
        if (this.state.project.tasks.length === 0) {
            table = <h4 className="text-center">{this.state.project.name} has no tasks.</h4>
        } else {
            table =
                <Table striped responsive>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
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
                                        <td className="text-center">
                                            <Button variant="success"><FontAwesomeIcon icon={faPencilAlt} /></Button>
                                        </td>
                                        <td className="text-center">
                                            <OverlayTrigger
                                                placement="top"
                                                delay={{ hide: 100 }}
                                                overlay={
                                                    <Tooltip>
                                                        Delete this task
                                                    </Tooltip>
                                                }
                                            >
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
                <TaskForm project={this.state.project} new={true} renderParent={this.renderMe}/>
                {table}
            </Col>
        )
    }
}
export default ProjectTable;