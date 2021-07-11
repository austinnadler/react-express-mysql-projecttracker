import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
// import projects from '../../assets/data/projects';
// import tasks from '../../assets/data/tasks';
import Axios from 'axios';

class Projects extends React.Component {
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
                        </tr>
                    </thead>
                    <tbody>
                        {
                        
                            this.state.tasks.map((t) => {
                                return (
                                    <tr key={t.id}>
                                        <td>{t.projectName}</td>
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
export default Projects;
