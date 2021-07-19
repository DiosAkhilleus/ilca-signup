const express = require('express');
const app = express();
const SailorModel = require('./models/Sailor');
const connectToDB = require('./db/conn');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const DB = process.env.DB;

app.use(express.json()); 
app.use(cors());

connectToDB();

app.get('/sailorinfo', (req, res) => {
  SailorModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    }
    res.send(result);
  });
});

app.post('/insertsailor', async (req, res) => {
  const sailorID = req.body.sailorID;
  const name = req.body.name;
  const sailNumber = req.body.sailNumber;
  const rig = req.body.rig;
  const dateEntered = req.body.dateEntered;
  const country = req.body.country;
  // const userName = req.body.userName;
  // const friends = req.body.friends;
  const sailor = new SailorModel ({
    sailorID: sailorID,
      name: name,
      sailNumber: sailNumber,
      rig: rig,
      dateEntered: dateEntered,
      country: country
  });
  try {
    await sailor.save();
  } catch (err) {
    console.error(err);
  }
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('Posted User');
})

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
})