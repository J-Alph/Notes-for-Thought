const fs = require("fs").promises;
const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();

// Import custom middleware, "cLog"


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.get('/notes', ( req, res) => 
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});



app.post("/api/notes", (req, res) => {
  req.body.id = uuidv4();
  fs.readFile("./db/db.json")
    .then((data) => {
      let newNotes = JSON.parse(data); //store parsed JSON into a new variable
      newNotes.push(req.body); //push new notes into the req.body
      return newNotes;
    })
    .then((notes) => {
      return fs.writeFile(`./db/db.json`, JSON.stringify(notes)); //object Object without stringify
    })
    .then(() => res.json(req.body));
});



app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
