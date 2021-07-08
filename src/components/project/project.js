import React from 'react';
import './project.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { faInfoCircle, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TitleBar from '../titlebar/titlebar';
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
    }

    componentDidMount() {
        document.title = this.state.project.name;
    }

    render() {
        return (
            <div className="container">
                <TitleBar title="Projects" textColor="success" />
                <Table bordered>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>State</th>
                            <th></th>
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
export default Project;