const mongoose = require('mongoose');

const NameSchema = new mongoose.Schema({
  firstName: {
    type: String, 
    required: true,
  },
  familyName: {
    type: String,
    required: true,
  }
});

const SailorSchema = new mongoose.Schema({
  sailorID: {
    type: String,
    required: true,
  },
  name: {
    type: NameSchema,
    required: true,
  },
  sailNumber: {
    type: String,
    required: true,
  },
  rig: {
    type: String,
    required: true,
  }, 
  dateEntered: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  }
});

const SailorModel = mongoose.model('Sailor', SailorSchema);

module.exports = SailorModel;