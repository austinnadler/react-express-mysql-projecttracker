import React from 'react';
import { Navbar, Nav/*, Dropdown */ } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHammer, faList } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router';

const NavBar = (props) => {
    const { location } = props;
    return (
        <Navbar bg="primary" variant="dark" expand="md" > 
            <Navbar.Toggle aria-controls="basic-navbar-nav" /> 
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav activeKey={location.pathname} className="mr-auto">
                    <LinkContainer to="/projects">
                        <Nav.Link><FontAwesomeIcon icon={faHammer} />&nbsp;Projects</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/tasks">
                        <Nav.Link><FontAwesomeIcon icon={faList} />&nbsp;Tasks</Nav.Link>
                    </LinkContainer>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default withRouter(NavBar);
