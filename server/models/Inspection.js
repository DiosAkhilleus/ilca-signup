const mongoose = require('mongoose');

const NameSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  familyName: {
    type: String,
    required: true
  }
})

const InspectionSchema = new mongoose.Schema({
  eventTitle: {
    type: String,
    required: true
  },
  sailorID: {
    type: String, 
    required: true
  },
  name: {
    type: NameSchema,
    required: true
  }, 
  time: {
    type: Number,
    required: true
  }, 
  day: {
    type: String,
    required: true
  }
});

const InspectionModel = mongoose.model('Inspection_Req', InspectionSchema);

module.exports = InspectionModel;