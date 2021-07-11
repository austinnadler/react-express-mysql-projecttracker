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

/* -------------------- /projects --------------------  */
app.get("/projects", (req, res) => {
    db.query("SELECT id, name, description FROM project", (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/numProjectTasks/:projectId", (req, res) => {
    const projectId = req.params.projectId;
    db.query("SELECT COUNT(*) as numTasks FROM task WHERE id = ?",
    projectId,
    (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.delete("/deleteProject/:projectId", (req, res) => {
    // MySQL database cascades on project deletion to delete associated tasks
    const projectId = Number(req.params.projectId);
    db.query("DELETE from project WHERE id = ?",
    projectId,
    (err, result) => {
        if(err) {
            console.log(err);
        } else {
            console.log(result);
            res.send(result);
        }
    });
});

app.post("/insertProject", (req, res) => {

});

app.put("/updateProject", (req, res) => {

});
/* -------------------- end /projects --------------------  */

app.get("/tasks", (req, res) => {
    db.query("SELECT p.name, t.name, t.description FROM task t, project p WHERE p.id = t.projectId",
    (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

const port = 3001;
app.listen(port, () => console.log("Server running on port " + port));