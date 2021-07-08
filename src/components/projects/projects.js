import React from 'react';
import './projects.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { faInfoCircle, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TitleBar from '../titlebar/titlebar';
import projects from '../../assets/data/projects';

class Projects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: projects
        };
    }

    componentDidMount() {
        document.title = "Projects";
    }

    goTo(id) {
        this.props.history.push(`/project/${id}`);
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
                            <th>Area</th>
                            <th>Manager</th>
                            <th>State</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.projects.map((p) => {
                                return (
                                    <tr key={p.id}>   
                                        <td>
                                            <Button onClick={() => this.goTo(p.id)} size="sm"><FontAwesomeIcon icon={faInfoCircle}/></Button>
                                            &nbsp;{p.name}
                                        </td>
                                        <td>{p.description}</td>
                                        <td>{p.area}</td>
                                        <td>{p.manager}</td>
                                        <td>{p.state}</td>
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