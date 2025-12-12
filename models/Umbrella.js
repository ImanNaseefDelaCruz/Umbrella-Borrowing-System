// models/Umbrella.js
const mongoose = require('mongoose');

const umbrellaSchema = new mongoose.Schema({
  umbrellaId: {
    type: String,
    required: true,
    unique: true
  },
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'borrowed', 'maintenance'],
    default: 'available'
  },
  color: String,
  size: {
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'medium'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Umbrella', umbrellaSchema);