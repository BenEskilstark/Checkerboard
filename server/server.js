const express = require('express');
const path = require('path');
const cors = require('cors');

const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors())

// make all of www available
app.use(express.static(path.join(__dirname, '../www')));

// could use this instead of statically making all of www available:
// app.use('/',
//   loginRequired,
//   express.static(path.join(__dirname, '../www'), {fallthrough: false}),
// );

app.use('/turn', (req, res) => {
  res.status(200).send({hello: "world"});
});

app.listen(port);
