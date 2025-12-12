// routes/borrow.js
const express = require('express');
const router = express.Router();
const BorrowRecord = require('../models/BorrowRecord');
const Umbrella = require('../models/Umbrella');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Borrow an umbrella
router.post('/borrow', auth, async (req, res) => {
  try {
    const { umbrellaId, stationId } = req.body;

    // Check if user already has an active borrow
    if (req.user.currentBorrow) {
      return res.status(400).json({ 
        success: false, 
        message: 'You already have an active umbrella borrow' 
      });
    }

    // Check if umbrella is available
    const umbrella = await Umbrella.findOne({
      _id: umbrellaId,
      station: stationId,
      status: 'available',
      isActive: true
    });

    if (!umbrella) {
      return res.status(400).json({ 
        success: false, 
        message: 'Umbrella not available' 
      });
    }

    // Create borrow record
    const borrowRecord = new BorrowRecord({
      user: req.userId,
      umbrella: umbrellaId,
      borrowStation: stationId
    });

    // Update umbrella status
    umbrella.status = 'borrowed';
    await umbrella.save();

    // Update user current borrow
    await User.findByIdAndUpdate(req.userId, {
      currentBorrow: borrowRecord._id,
      $push: { borrowHistory: borrowRecord._id }
    });

    await borrowRecord.save();
    await borrowRecord.populate('umbrella borrowStation', 'umbrellaId color size name location');

    res.json({ 
      success: true, 
      message: 'Umbrella borrowed successfully', 
      data: borrowRecord 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Return an umbrella
router.post('/return', auth, async (req, res) => {
  try {
    const { umbrellaId, stationId } = req.body;

    // Find active borrow record
    const borrowRecord = await BorrowRecord.findOne({
      user: req.userId,
      status: 'active'
    }).populate('umbrella');

    if (!borrowRecord) {
      return res.status(400).json({ 
        success: false, 
        message: 'No active borrow found' 
      });
    }

    // Verify the umbrella matches
    if (borrowRecord.umbrella._id.toString() !== umbrellaId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Umbrella does not match current borrow' 
      });
    }

    // Update umbrella
    const umbrella = await Umbrella.findById(umbrellaId);
    umbrella.status = 'available';
    umbrella.station = stationId;
    await umbrella.save();

    // Update borrow record
    borrowRecord.returnStation = stationId;
    borrowRecord.returnTime = new Date();
    borrowRecord.status = 'returned';
    await borrowRecord.save();

    // Update user
    await User.findByIdAndUpdate(req.userId, {
      currentBorrow: null
    });

    await borrowRecord.populate('returnStation', 'name location');

    res.json({ 
      success: true, 
      message: 'Umbrella returned successfully', 
      data: borrowRecord 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get current borrow
router.get('/current', auth, async (req, res) => {
  try {
    const borrowRecord = await BorrowRecord.findOne({
      user: req.userId,
      status: 'active'
    }).populate('umbrella borrowStation', 'umbrellaId color size name location');

    res.json({ success: true, data: borrowRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get borrow history
router.get('/history', auth, async (req, res) => {
  try {
    const borrowRecords = await BorrowRecord.find({
      user: req.userId
    })
    .populate('umbrella borrowStation returnStation', 'umbrellaId name location')
    .sort({ borrowTime: -1 });

    res.json({ success: true, data: borrowRecords });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;