import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import CouncilsAndCompanies from '../models/CouncilsAndCompanies.js';
import { authenticate } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.doc', '.docx'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only Word documents are allowed'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Get all councils and companies
router.get('/', authenticate, async (req, res) => {
  try {
    const councils = await CouncilsAndCompanies.find().sort({ createdAt: -1 });
    res.json(councils);
  } catch (error) {
    console.error('Error fetching councils:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single council/company
router.get('/:id', authenticate, async (req, res) => {
  try {
    const council = await CouncilsAndCompanies.findById(req.params.id);
    if (!council) {
      return res.status(404).json({ message: 'Council/Company not found' });
    }
    res.json(council);
  } catch (error) {
    console.error('Error fetching council:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new council/company
router.post('/', authenticate, upload.fields([
  { name: 'wordfilenoticeletter', maxCount: 1 },
  { name: 'wordfileboth', maxCount: 1 },
  { name: 'wordfileunusualwastewater', maxCount: 1 },
  { name: 'wordfileforbiddenwastewater', maxCount: 1 },
  { name: 'wordfilepaymentletter', maxCount: 1 }
]), async (req, res) => {
  try {
    const councilData = {
      ...req.body,
      mts: req.body.mts ? JSON.parse(req.body.mts) : []
    };

    // Handle file uploads
    if (req.files) {
      Object.keys(req.files).forEach(fieldName => {
        if (req.files[fieldName] && req.files[fieldName][0]) {
          councilData[fieldName] = req.files[fieldName][0].filename;
        }
      });
    }

    const council = new CouncilsAndCompanies(councilData);
    await council.save();
    res.status(201).json(council);
  } catch (error) {
    console.error('Error creating council:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update council/company
router.put('/:id', authenticate, upload.fields([
  { name: 'wordfilenoticeletter', maxCount: 1 },
  { name: 'wordfileboth', maxCount: 1 },
  { name: 'wordfileunusualwastewater', maxCount: 1 },
  { name: 'wordfileforbiddenwastewater', maxCount: 1 },
  { name: 'wordfilepaymentletter', maxCount: 1 }
]), async (req, res) => {
  try {
    const councilData = {
      ...req.body,
      mts: req.body.mts ? JSON.parse(req.body.mts) : []
    };

    // Handle file uploads
    if (req.files) {
      Object.keys(req.files).forEach(fieldName => {
        if (req.files[fieldName] && req.files[fieldName][0]) {
          councilData[fieldName] = req.files[fieldName][0].filename;
        }
      });
    }

    const council = await CouncilsAndCompanies.findByIdAndUpdate(
      req.params.id,
      councilData,
      { new: true, runValidators: true }
    );

    if (!council) {
      return res.status(404).json({ message: 'Council/Company not found' });
    }

    res.json(council);
  } catch (error) {
    console.error('Error updating council:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete council/company
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const council = await CouncilsAndCompanies.findByIdAndDelete(req.params.id);
    if (!council) {
      return res.status(404).json({ message: 'Council/Company not found' });
    }
    res.json({ message: 'Council/Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting council:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;