import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// Components
import NavBar from './components/navbar/navbar';
// import Footer from './components/footer/footer';
import Projects from './components/projects/projects';
import Project from './components/project/project';
import Tasks from './components/tasks/tasks';

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <NavBar />
            <Switch>
                <Route exact path="/" component={Projects} />
                <Route path="/projects" component={Projects} />
                <Route path="/project/:pid" component={Project} />
                <Route path="/tasks" component={Tasks} />
            </Switch>
        </Router>
        {/* <Footer /> */}
    </React.StrictMode>,
  document.getElementById('root')
);