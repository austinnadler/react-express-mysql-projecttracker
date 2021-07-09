import React from 'react';
import './tasks.css';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TitleBar from '../titlebar/titlebar';
// import projects from '../../assets/data/projects';
import tasks from '../../assets/data/tasks';

class Projects extends React.Component {
    constructor(props) {
        super(props);
        var _tasks = tasks;
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
                <TitleBar title="Tasks" textColor="success" />
                <Table bordered responsive>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Description</th>
                            <th>State</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.tasks.map((t) => {
                                return (
                                    <tr key={t.id}>
                                        <td>{t.name}</td>
                                        <td>{t.description}</td>
                                        <td>{t.state}</td>
                                        <td className="text-center">
                                            <Button variant="success" className="mr-1"><FontAwesomeIcon icon={faPencilAlt}/></Button>
                                        </td>
                                        <td className="text-center">
                                            <Button variant="danger"><FontAwesomeIcon icon={faTrash}/></Button>
                                        </td>
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