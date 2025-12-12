const express = require('express');
const router = express.Router();
const Station = require('../models/Station');
const User = require('../models/User');
const Umbrella = require('../models/Umbrella');
const BorrowRecord = require('../models/BorrowRecord');
const auth = require('../middleware/auth');

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

// Initialize data
router.post('/initialize', auth, isAdmin, async (req, res) => {
  try {
    // Clear existing data
    await Station.deleteMany({});
    await Umbrella.deleteMany({});

    // Create stations
    const stations = await Station.insertMany([
      {
        name: 'Main Gate',
        location: 'University Main Entrance',
        address: 'Main Gate, University Campus',
        totalSlots: 20,
        isActive: true
      },
      {
        name: 'Back Gate',
        location: 'University Back Entrance',
        address: 'Back Gate, University Campus',
        totalSlots: 15,
        isActive: true
      },
      {
        name: 'College of Natural Science and Mathematics (CNSM)',
        location: 'CNSM Building',
        address: 'Natural Sciences Building, University Campus',
        totalSlots: 25,
        isActive: true
      },
      {
        name: 'College of Social Science and Humanities (CSSH)',
        location: 'CSSH Building',
        address: 'Social Sciences Building, University Campus',
        totalSlots: 20,
        isActive: true
      },
      {
        name: 'College of Fisheries (CoF)',
        location: 'Fisheries Building',
        address: 'Fisheries Department, University Campus',
        totalSlots: 15,
        isActive: true
      },
      {
        name: 'College of Education (CoEd)',
        location: 'Education Building',
        address: 'Education Department, University Campus',
        totalSlots: 20,
        isActive: true
      },
      {
        name: 'College of Engineering (COE)',
        location: 'Engineering Building',
        address: 'Engineering Department, University Campus',
        totalSlots: 30,
        isActive: true
      },
      {
        name: 'College of Agriculture (CoA)',
        location: 'Agriculture Building',
        address: 'Agriculture Department, University Campus',
        totalSlots: 18,
        isActive: true
      },
      {
        name: 'Library',
        location: 'Main Library Building',
        address: 'Central Library, University Campus',
        totalSlots: 35,
        isActive: true
      }
    ]);

    // Create umbrellas for each station
    const umbrellas = [];
    const colors = ['Blue', 'Red', 'Green', 'Black', 'Transparent', 'Yellow'];
    const sizes = ['small', 'medium', 'large'];

    let umbrellaCounter = 1;

    stations.forEach(station => {
      for (let i = 1; i <= 5; i++) {
        umbrellas.push({
          umbrellaId: `UMB-${umbrellaCounter.toString().padStart(3, '0')}`,
          station: station._id,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: sizes[Math.floor(Math.random() * sizes.length)],
          status: 'available',
          isActive: true
        });
        umbrellaCounter++;
      }
    });

    await Umbrella.insertMany(umbrellas);

    res.json({
      success: true,
      message: 'Stations and umbrellas initialized successfully',
      data: {
        stations: stations.length,
        umbrellas: umbrellas.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all stations
router.get('/stations', auth, isAdmin, async (req, res) => {
  try {
    const stations = await Station.find();
    res.json({ success: true, data: stations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all users
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all borrow records
router.get('/borrow-records', auth, isAdmin, async (req, res) => {
  try {
    const records = await BorrowRecord.find()
      .populate('user', 'name email')
      .populate('umbrella', 'umbrellaId')
      .populate('borrowStation returnStation', 'name location')
      .sort({ borrowTime: -1 });

    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get active borrows
router.get('/active-borrows', auth, isAdmin, async (req, res) => {
  try {
    const activeBorrows = await BorrowRecord.find({ status: 'active' })
      .populate('user', 'name email')
      .populate('umbrella', 'umbrellaId')
      .populate('borrowStation', 'name location');

    res.json({ success: true, data: activeBorrows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create station
router.post('/stations', auth, isAdmin, async (req, res) => {
  try {
    const station = new Station(req.body);
    await station.save();
    res.status(201).json({ success: true, data: station });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Reset user borrowing status
router.patch('/users/:userId/reset', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { currentBorrow: null },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User reset successfully', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all umbrellas
router.get('/umbrellas', auth, isAdmin, async (req, res) => {
  try {
    const umbrellas = await Umbrella.find().populate('station', 'name location');
    res.json({ success: true, data: umbrellas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create umbrella
router.post('/umbrellas', auth, isAdmin, async (req, res) => {
  try {
    const umbrella = new Umbrella(req.body);
    await umbrella.save();
    await umbrella.populate('station', 'name location');
    res.status(201).json({ success: true, data: umbrella });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update umbrella
router.put('/umbrellas/:id', auth, isAdmin, async (req, res) => {
  try {
    const umbrella = await Umbrella.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('station', 'name location');

    res.json({ success: true, data: umbrella });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;