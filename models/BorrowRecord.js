// models/BorrowRecord.js
const mongoose = require('mongoose');

const borrowRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  umbrella: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Umbrella',
    required: true
  },
  borrowStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    required: true
  },
  returnStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station'
  },
  borrowTime: {
    type: Date,
    default: Date.now
  },
  returnTime: Date,
  status: {
    type: String,
    enum: ['active', 'returned', 'overdue'],
    default: 'active'
  },
  dueTime: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from borrow
  }
}, { timestamps: true });

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);