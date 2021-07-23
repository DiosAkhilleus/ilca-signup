const mongoose = require('mongoose');

const TimeslotOptionSchema = new mongoose.Schema({
  unavailableSlots: {
    type: Array, 
    required: true
  },
  interval: {
    type: Number,
    required: true
  }, 
  selectedDate: {
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
  }
})

const TimeslotOptionModel = mongoose.model('Timeslot_Option', TimeslotOptionSchema);
