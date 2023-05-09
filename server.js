const fs = require ('fs');
const express = require('express');
const path = require('path');
// const api = require('./routes/index.js');
// const notes = require('./public/notes.html');

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


app.get('/db', (req, res)=>{
  res.json(`${req.method} request received`);

  console.log(req.rawHeaders);

  console.log(`${req.method} request receieved`)
}
);

app.post('/db', ( req, res) =>{
  res.json(path.join(__dirname, '/db/db.json'))


  console.log(`${req.method} request receieved`)
}

);

// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
