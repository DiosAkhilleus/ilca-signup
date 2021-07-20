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

const SignupSchema = new mongoose.Schema({
  sailorID: {
    type: String, 
    required: true
  },
  name: {
    type: NameSchema,
    required: true
  }, 
  timeSlot: {
    type: Number,
    required: true
  }
});

const SignupModel = mongoose.model('Signup', SignupSchema);

module.exports = SignupModel;