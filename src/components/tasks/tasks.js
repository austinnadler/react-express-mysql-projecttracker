import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
// import Button from 'react-bootstrap/Button';
// import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import projects from '../../assets/data/projects';
import tasks from '../../assets/data/tasks';

class Projects extends React.Component {
    constructor(props) {
        super(props);
        var _tasks = tasks.sort((a, b) => { return a.projectId - b.projectId }); // sort ascending
        _tasks.forEach(t => {
            projects.forEach(p => {
                if(t.projectId === p.id) {
                    t.project = p;
                }
            });
        });
        this.state = {
            tasks: _tasks
        };
    }

    componentDidMount() {
        document.title = "Tasks";
    }

    render() {
        return (
            <Container>
                <Col xs={12} className="mt-3 mb-3 text-center">
                    <h1 className="text-success">Tasks</h1>
                </Col>
                <Table striped responsive>
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Task</th>
                            <th>Description</th>
                            {/* <th>Edit</th>
                            <th>Delete</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.tasks.map((t) => {
                                return (
                                    <tr key={t.id}>
                                        <td>{t.project.name}</td>
                                        <td>{t.name}</td>
                                        <td>{t.description}</td>
                                        {/* <td className="text-center">
                                            <Button variant="success" className="mr-1"><FontAwesomeIcon icon={faPencilAlt} /></Button>
                                        </td>
                                        <td className="text-center">
                                            <Button variant="danger"><FontAwesomeIcon icon={faTrash} /></Button>
                                        </td> */}
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
            </Container>
        )
    };
}
export default Projects;