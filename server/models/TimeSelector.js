const mongoose = require('mongoose');

const TimeSelectorSchema = new mongoose.Schema({
  unavailableSlots: {
    type: Array, 
    required: true
  },
  interval: {
    type: Number,
    required: true
  }, 
  selectedDate: {
    type: Date, 
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

const TimeSelectorModel = mongoose.model('Time_Selector', TimeSelectorSchema);
