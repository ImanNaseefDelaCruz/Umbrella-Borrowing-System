// routes/stations.js
const express = require('express');
const router = express.Router();
const Station = require('../models/Station');
const auth = require('../middleware/auth');

// Get all stations
router.get('/', auth, async (req, res) => {
  try {
    const stations = await Station.find({ isActive: true });
    res.json({ success: true, data: stations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create station (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const station = new Station(req.body);
    await station.save();
    res.status(201).json({ success: true, data: station });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;