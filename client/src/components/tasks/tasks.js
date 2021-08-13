import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Axios from 'axios';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

class Tasks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: []
        };
    }

    componentDidMount() {
        document.title = "Tasks";
        Axios.get("http://localhost:3001/tasks").then(response => {
            this.setState({ tasks: response.data });
        });
    }

    goTo(id, e) {
        if (e.button === 0) this.props.history.push(`/tasks/${id}`);
    }

    render() {
        return (
            <Container>
                <Col xs={12} className="mt-3 mb-3 text-center">
                    <h1 className="text-success">Tasks</h1>
                    <div>
                        Select the row button to open the project and edit tasks
                    </div>
                </Col>
                <Table striped responsive>
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Task</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        
                            this.state.tasks.map((t) => {
                                return (
                                    <tr key={t.id}>
                                        <td>
                                            <Button onMouseDown={(e) => this.goTo(t.projectId, e)}><FontAwesomeIcon icon={faExternalLinkAlt}></FontAwesomeIcon></Button>
                                            &nbsp;&nbsp;{t.projectName}
                                        </td>
                                        <td>{t.name}</td>
                                        <td>{t.description}</td>
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
export default Tasks;