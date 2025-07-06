import express from 'express';
import Sectors from '../models/Sectors.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all sectors
router.get('/', authenticate, async (req, res) => {
  try {
    const sectors = await Sectors.find().sort({ createdAt: -1 });
    res.json(sectors);
  } catch (error) {
    console.error('Error fetching sectors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single sector
router.get('/:id', authenticate, async (req, res) => {
  try {
    const sector = await Sectors.findById(req.params.id);
    if (!sector) {
      return res.status(404).json({ message: 'Sector not found' });
    }
    res.json(sector);
  } catch (error) {
    console.error('Error fetching sector:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new sector
router.post('/', authenticate, async (req, res) => {
  try {
    const sector = new Sectors(req.body);
    await sector.save();
    res.status(201).json(sector);
  } catch (error) {
    console.error('Error creating sector:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update sector
router.put('/:id', authenticate, async (req, res) => {
  try {
    const sector = await Sectors.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!sector) {
      return res.status(404).json({ message: 'Sector not found' });
    }

    res.json(sector);
  } catch (error) {
    console.error('Error updating sector:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete sector
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const sector = await Sectors.findByIdAndDelete(req.params.id);
    if (!sector) {
      return res.status(404).json({ message: 'Sector not found' });
    }
    res.json({ message: 'Sector deleted successfully' });
  } catch (error) {
    console.error('Error deleting sector:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;