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
  selectedDates: {
    type: Array, 
    required: true
  },
  eventTitle: {
    type: String,
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
