const express = require('express');
const app = express();
const SailorModel = require('./models/Sailor');
const InspectionModel = require('./models/Inspection');
const connectToDB = require('./db/conn');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const DB = process.env.DB;

app.use(express.json()); 
app.use(cors());

connectToDB();

app.get('/', (req, res) => {
  console.log(req.baseUrl);
});

app.get('/sailorinfo', (req, res) => {
  SailorModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    } 
    res.send(result);
  });
});

app.get('/timeslots/filled', (req, res) => {
  InspectionModel.find({}, (err, result) => {
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
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end('Posted User');
})

app.post('/reqtimeslot', async (req, res) => {
  const sailorID = req.body.sailorID;
  const name = req.body.name;
  const time = req.body.time;
  const day = req.body.day;
  console.log(sailorID, name, time, day);
  const inspection = new InspectionModel ({
    sailorID: sailorID,
    name: name,
    time: time, 
    day: day
  });
  try {
    await inspection.save();
  } catch(err) {
    console.error(err);
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end('Posted Timeslot Request');
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
})