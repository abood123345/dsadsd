import express from 'express';
import TestedComponents from '../models/TestedComponents.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all tested components
router.get('/', authenticate, async (req, res) => {
  try {
    const components = await TestedComponents.find().sort({ createdAt: -1 });
    res.json(components);
  } catch (error) {
    console.error('Error fetching components:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single tested component
router.get('/:id', authenticate, async (req, res) => {
  try {
    const component = await TestedComponents.findById(req.params.id);
    if (!component) {
      return res.status(404).json({ message: 'Tested component not found' });
    }
    res.json(component);
  } catch (error) {
    console.error('Error fetching component:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new tested component
router.post('/', authenticate, async (req, res) => {
  try {
    const component = new TestedComponents(req.body);
    await component.save();
    res.status(201).json(component);
  } catch (error) {
    console.error('Error creating component:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update tested component
router.put('/:id', authenticate, async (req, res) => {
  try {
    const component = await TestedComponents.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!component) {
      return res.status(404).json({ message: 'Tested component not found' });
    }

    res.json(component);
  } catch (error) {
    console.error('Error updating component:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete tested component
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const component = await TestedComponents.findByIdAndDelete(req.params.id);
    if (!component) {
      return res.status(404).json({ message: 'Tested component not found' });
    }
    res.json({ message: 'Tested component deleted successfully' });
  } catch (error) {
    console.error('Error deleting component:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;