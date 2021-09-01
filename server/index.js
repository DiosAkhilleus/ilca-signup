const express = require('express');
const app = express();
const SailorModel = require('./models/Sailor');
const SignupSheetModel = require('./models/SignupSheet');
const connectToDB = require('./db/conn');
const cors = require('cors');
const Axios = require('axios');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const MNKEY = process.env.MNKEY;
const EDURL = process.env.EDURL;
const SDURL = process.env.SDURL;

app.use(express.json());
app.use(cors());

connectToDB(); // Connects to MongoDB

app.get('/', (req, res) => {
  console.log(req.baseUrl);
});

app.get('/sailorinfo', (req, res) => {
  // Retrieves all entered sailors
  SailorModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    }
    res.send(result);
  });
});

app.put('/signups/updateinspecs/:ilcaNum', async (req, res) => {
  const ilcaNum = req.params.ilcaNum;
  const inspectionReqs = req.body.inspectionReqs;
  const slotsAvailableByDay = req.body.slotsAvailableByDay;
  SignupSheetModel.findOneAndUpdate(
    { ilcaNum: ilcaNum },
    {
      inspectionReqs: inspectionReqs,
      slotsAvailableByDay: slotsAvailableByDay,
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

app.put('/signups/removesailor/:sailorID/:ilcaNum', async (req, res) => {
  const ilcaNum = req.params.ilcaNum;
  const inspectionReqs = req.body.inspectionReqs;
  SignupSheetModel.findOneAndUpdate(
    { ilcaNum: ilcaNum },
    {
      inspectionReqs: inspectionReqs,
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

app.get('/signups/options', async (req, res) => {
  // Retrieves all inspection signups created by admin
  SignupSheetModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    }
    res.send(result);
  });
});

app.get('/events/details/:ilcaNum', (req, res) => {
  const ilcaNum = req.params.ilcaNum;
  Axios.get(`${EDURL}/${ilcaNum}/${MNKEY}`)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get('/events/sailors/:ilcaNum', (req, res) => {
  const ilcaNum = req.params.ilcaNum;
  Axios.get(`${SDURL}/${ilcaNum}/${MNKEY}`)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.post('/signups/created', async (req, res) => {
  // Posts a new inspection signup from the admin page
  const slotsAvailableByDay = req.body.slotsAvailableByDay;
  const inspectionReqs = req.body.inspectionReqs;
  const interval = req.body.interval;
  const selectedDates = req.body.selectedDates;
  const shutoffDate = req.body.shutoffDate;
  const eventTitle = req.body.eventTitle;
  const hostCity = req.body.hostCity;
  const hostCountry = req.body.hostCountry;
  const ilcaNum = req.body.ilcaNum;
  const timeFrom = req.body.timeFrom;
  const timeTo = req.body.timeTo;
  const uuid = req.body.uuid;
  const timeslot = new SignupSheetModel({
    slotsAvailableByDay: slotsAvailableByDay,
    inspectionReqs: inspectionReqs,
    interval: interval,
    selectedDates: selectedDates,
    shutoffDate: shutoffDate,
    eventTitle: eventTitle,
    hostCity: hostCity, 
    hostCountry: hostCountry,
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

app.put('/signups/update/:uuid', async (req, res) => {
  // Updates an inspection signup by UUID
  const uuid = req.params.uuid;
  const slotsAvailableByDay = req.body.slotsAvailableByDay;
  const unavailableSlots = req.body.unavailableSlots;
  const inspectionReqs = req.body.inspectionReqs;
  SignupSheetModel.findOneAndUpdate(
    { uuid: uuid },
    {
      slotsAvailableByDay: slotsAvailableByDay,
      unavailableSlots: unavailableSlots,
      inspectionReqs: inspectionReqs,
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

app.post('/insertsailor', async (req, res) => {
  // Adds a new sailor to the currently entered sailors list
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

app.delete('/signups/delete/:ilcaNum', async (req, res) => {
  const ilcaNum = req.params.ilcaNum;
  SignupSheetModel.findOneAndRemove(
    { ilcaNum: ilcaNum },
    { useFindAndModify: false },
    (err, result) => {
      if (err) {
        res.send(err);
      }
      res.send(result);
    }
  );
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
