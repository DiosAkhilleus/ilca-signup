const express = require('express');
const app = express();
const SailorModel = require('./models/Sailor');
const TimeslotOptionModel = require('./models/TimeslotOptions');
const connectToDB = require('./db/conn');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

connectToDB(); // Connects to MongoDB

app.get('/', (req, res) => {
  console.log(req.baseUrl);
});

app.get('/sailorinfo', (req, res) => { // Retrieves all entered sailors
  SailorModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    }
    res.send(result);
  });
});



app.get('/timeslots/options', async (req, res) => { // Retrieves all inspection signups created by admin
  TimeslotOptionModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    }
    res.send(result);
  });
});

app.post('/timeslots/created', async (req, res) => { // Posts a new inspection signup from the admin page
  const slotsAvailableByDay = req.body.slotsAvailableByDay;
  const inspectionReqs = req.body.inspectionReqs;
  const interval = req.body.interval;
  const selectedDates = req.body.selectedDates;
  const eventTitle = req.body.eventTitle;
  const ilcaNum = req.body.ilcaNum;
  const timeFrom = req.body.timeFrom;
  const timeTo = req.body.timeTo;
  const uuid = req.body.uuid;
  const timeslot = new TimeslotOptionModel({
    slotsAvailableByDay: slotsAvailableByDay,
    inspectionReqs: inspectionReqs,
    interval: interval,
    selectedDates: selectedDates,
    eventTitle: eventTitle,
    ilcaNum: ilcaNum,
    timeFrom: timeFrom,
    timeTo: timeTo,
    uuid: uuid,
  });
  try {
    await timeslot.save();
  } catch (err) {
    console.error(err);
  }
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end('Posted Timeslot');
});

app.put('/timeslots/update/:uuid', async (req, res) => { // Updates an inspection signup by UUID
  const uuid = req.params.uuid;
  const slotsAvailableByDay = req.body.slotsAvailableByDay;
  const unavailableSlots = req.body.unavailableSlots;
  const inspectionReqs = req.body.inspectionReqs;
  TimeslotOptionModel.findOneAndUpdate(
    { uuid: uuid },
    {
      slotsAvailableByDay: slotsAvailableByDay,
      unavailableSlots: unavailableSlots,
      inspectionReqs: inspectionReqs
    },
    { new: true, useFindAndModify: false },
    (err, result) => {
      if (err) {
        res.send(err);
      }
      res.send(result);
    }
  );
});

app.post('/insertsailor', async (req, res) => { // Adds a new sailor to the currently entered sailors list
  const sailorID = req.body.sailorID;
  const name = req.body.name;
  const sailNumber = req.body.sailNumber;
  const rig = req.body.rig;
  const dateEntered = req.body.dateEntered;
  const country = req.body.country;

  const sailor = new SailorModel({
    sailorID: sailorID,
    name: name,
    sailNumber: sailNumber,
    rig: rig,
    dateEntered: dateEntered,
    country: country,
  });
  try {
    await sailor.save();
  } catch (err) {
    console.error(err);
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end('Posted User');
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
