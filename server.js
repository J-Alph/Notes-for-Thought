const fs = require("fs").promises;
const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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

// route for posting to notes

app.post("/api/notes", (req, res) => {
  req.body.id = uuidv4();
  fs.readFile("./db/db.json")
    .then((data) => {
      let newNotes = JSON.parse(data); //store parsed JSON into a new variable
      newNotes.push(req.body); //push new notes into the req.body
      return newNotes;
    })
    .then((notes) => {
      return fs.writeFile(`./db/db.json`, JSON.stringify(notes)); 
    })
    .then(() => res.json(req.body));
});


//route for deleting notes

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile("./db/db.json")
    .then((data) => {
      let notes = JSON.parse(data);
      let index = notes.findIndex((note) => note.id === id);
      if (index !== -1) {
        notes.splice(index, 1);
        return fs.writeFile(`./db/db.json`, JSON.stringify(notes));
      } else {
        throw new Error("Note not found");
      }
    })
    .then(() => res.status(204).send())
    .catch((err) => {
      console.error(err);
      res.status(500).send("Server error");
    });
});



app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// listen() method is responsible for listening for incoming connections 
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
