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

app.delete("/deleteProject", (req, res) => {

});

const port = 3001;
app.listen(port, () => console.log("Server running on port " + port));