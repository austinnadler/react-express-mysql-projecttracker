import React from "react";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ProjectTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: props.project
        }
    }

    render() {
        var table;
        if (this.state.project.tasks.length === 0) {
            table = <h4 className="text-center">{this.state.project.name} has no tasks.</h4>
        } else {
            table =
                <Table bordered responsive>
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
        return table;
    }
}
export default ProjectTable;