import express from 'express';
import Business from '../models/Business.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all clients
router.get('/', authenticate, async (req, res) => {
  try {
    const businesses = await Business.find()
      .populate('institutionId', 'name type')
      .populate('sectorId', 'sectorName')
      .sort({ createdAt: -1 });
    res.json(businesses);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single client
router.get('/:id', authenticate, async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate('institutionId', 'name type')
      .populate('sectorId', 'sectorName');

    if (!business) {
      return res.status(404).json({ message: 'business not found' });
    }
    res.json(business);
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new client
router.post('/', authenticate, async (req, res) => {
  try {
    const business = new Business(req.body);
    await business.save();

    const populatedBusiness = await Business.findById(business._id)
      .populate('institutionId', 'name type')
      .populate('sectorId', 'sectorName');

    res.status(201).json(populatedBusiness);
  } catch (error) {
    console.error('Error creating business:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update client
router.put('/:id', authenticate, async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('institutionId', 'name type')
      .populate('sectorId', 'sectorName');

    if (!business) {
      return res.status(404).json({ message: 'business not found' });
    }

    res.json(business);
  } catch (error) {
    console.error('Error updating business:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete client
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const business = await Business.findByIdAndDelete(req.params.id);
    if (!business) {
      return res.status(404).json({ message: 'business not found' });
    }
    res.json({ message: 'business deleted successfully' });
  } catch (error) {
    console.error('Error deleting business:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;