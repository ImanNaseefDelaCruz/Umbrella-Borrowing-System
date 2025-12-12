const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  currentBorrow: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BorrowRecord',
    default: null
  },
  borrowHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BorrowRecord'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);