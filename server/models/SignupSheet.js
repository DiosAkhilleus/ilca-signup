const mongoose = require('mongoose');

const SignupSheetSchema = new mongoose.Schema({
  slotsAvailableByDay: {
    type: Object,
    required: true
  },
  inspectionReqs: {
    type: Array,
    required: true
  },
  interval: {
    type: Number,
    required: true
  }, 
  entryLimit: {
    type: Number,
    required: true
  },
  selectedDates: {
    type: Array, 
    required: true
  },
  shutoffDate: {
    type: Date,
    required: true
  },
  eventTitle: {
    type: String,
    required: true
  },
  hostCity: {
    type: String, 
    required: true
  }, 
  hostCountry: {
    type: String,
    required: true
  },
  logoURL: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  ilcaNum: {
    type: String,
    required: true
  },
  timeFrom: {
    type: Number,
    required: true
  },
  timeTo: {
    type: Number,
    required: true
  }, 
  uuid: {
    type: String,
    required: true
  }
})

const SignupSheetModel = mongoose.model('Signup_Sheet', SignupSheetSchema);

module.exports = SignupSheetModel;
