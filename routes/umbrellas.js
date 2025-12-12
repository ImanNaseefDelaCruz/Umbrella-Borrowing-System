// routes/umbrellas.js
const express = require('express');
const router = express.Router();
const Umbrella = require('../models/Umbrella');
const auth = require('../middleware/auth');

// Get available umbrellas by station
router.get('/station/:stationId', auth, async (req, res) => {
  try {
    const umbrellas = await Umbrella.find({
      station: req.params.stationId,
      status: 'available',
      isActive: true
    }).populate('station', 'name location');

    res.json({ success: true, data: umbrellas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create umbrella (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const umbrella = new Umbrella(req.body);
    await umbrella.save();
    await umbrella.populate('station', 'name location');

    res.status(201).json({ success: true, data: umbrella });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update umbrella (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

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

// Delete umbrella (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    await Umbrella.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Umbrella deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;