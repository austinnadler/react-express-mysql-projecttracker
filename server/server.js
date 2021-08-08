const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'ptracker'
});

const port = 3001;
app.listen(port, () => console.log("Server running on port " + port));

/* -------------------- /projects --------------------  */

app.get("/projects", (req, res) => {
    db.query(
        "SELECT p.id, p.name, p.description, p.state, c.display_value as 'state_display' FROM project p, choice c WHERE p.state = c.value ORDER BY p.state, p.id;",
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/numProjectTasks/:projectId", (req, res) => {
    const projectId = req.params.projectId;
    db.query(
        // Count the tasks whose state is not 30 (Complete)
        "SELECT COUNT(*) as numTasks FROM task WHERE projectId = ? AND state != 40",
        projectId,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});
app.post("/insertProject", (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const state = req.body.state;
    db.query(
        "INSERT INTO project (name, description, state) values (?, ?, ?)",
        [name, description, state],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Insert success");
            }
        }
    );
});

app.put("/updateProject/:projectId", (req, res) => {
    const projectId = Number(req.params.projectId);
    const name = req.body.name;
    const description = req.body.description;
    const state = req.body.state;
    db.query(
        "UPDATE project SET name = ?, description = ?, state = ? WHERE id = ?",
        [name, description, state, projectId],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.delete("/deleteProject/:projectId", (req, res) => {
    // MySQL database cascades on project deletion to delete associated tasks
    const projectId = Number(req.params.projectId);
    db.query(
        "DELETE from project WHERE id = ?",
        projectId,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

/* -------------------- end /projects --------------------  */

/* -------------------- /projectTasks --------------------  */

app.get(`/project/:projectId`, (req, res) => {
    const projectId = Number(req.params.projectId);
    db.query(
        "SELECT id, name, description FROM project WHERE id = ?",
        projectId,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.get(`/projectTasks/:projectId`, (req, res) => {
    const projectId = req.params.projectId;
    db.query(
        "SELECT id, name, description FROM task WHERE projectId = ?",
        projectId,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.post("/createTask/:projectId", (req, res) => {
    const projectId = req.params.projectId;
    const name = req.body.name;
    const description = req.body.description;
    db.query(
        "INSERT INTO task (projectId, name, description) values (?, ?, ?)",
        [projectId, name, description],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Insert success");
            }
        }
    );
});

app.put("/updateTask/:taskId", (req, res) => {
    const taskId = req.params.taskId;
    const name = req.body.name;
    const description = req.body.description;
    db.query(
        "UPDATE task SET name = ?, description = ? WHERE id = ?",
        [name, description, taskId],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.delete("/deleteTask/:taskId", (req, res) => {
    const taskId = req.params.taskId;
    db.query(
        "DELETE FROM task WHERE id = ?",
        taskId,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

/* -------------------- end /projectTasks --------------------  */

/* -------------------- /tasks --------------------  */

app.get("/tasks", (req, res) => {
    db.query(
        "SELECT p.id as projectId, t.id as id, p.name as projectName, t.name as name, t.description as description FROM task t, project p WHERE p.id = t.projectId ORDER BY p.id, t.id",
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

/* -------------------- end /tasks --------------------  */

/* -------------------- /states --------------------  */

app.get("/states", (req, res) => {
    db.query(
        "SELECT value, display_value FROM choice WHERE type = 'state'",
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

/* -------------------- end /states --------------------  */