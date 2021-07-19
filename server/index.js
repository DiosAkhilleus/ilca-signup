const express = require('express');
const app = express();
const SailorModel = require('./models/Sailor');
require('dotenv').config();

const PORT = process.env.PORT;
const DB = process.env.DB;


app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
  res.end();
});

app.listen(3000, () => {
  console.log('server listening on port 3000');
})