import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
//// Components
import NavBar from './components/navbar/navbar';
// import Footer from './components/footer/footer';
import Projects from './components/projects/projects';
import ProjectTasks from './components/projectTasks/main';
import Tasks from './components/tasks/tasks';

ReactDOM.render(
    // <React.StrictMode>
        <Router>
            <NavBar />
            <Switch>
                <Route exact path="/" component={Projects} />
                <Route path="/projects" component={Projects} />
                <Route exact path="/tasks" component={Tasks} />
                <Route path="/tasks/:pid" component={ProjectTasks} />
            </Switch>
        </Router>
        // <Footer />
    // </React.StrictMode>  
  ,document.getElementById('root')
);
