// models/Station.js
const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  totalSlots: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  coordinates: {
    lat: Number,
    lng: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Station', stationSchema);