import React from 'react';
import './tasks.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { faInfoCircle, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
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
            <div className="container">
                <TitleBar title="Tasks" textColor="success" />
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Task</th>
                            <th>Description</th>
                            <th>State</th>
                            <th></th>
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
                                            <Button variant="success" className="mr-1"><FontAwesomeIcon icon={faEdit}/></Button>
                                            <Button variant="danger"><FontAwesomeIcon icon={faTrash}/></Button>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
            </div>
        )
    };
}
export default Projects;