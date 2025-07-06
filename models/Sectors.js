import mongoose from 'mongoose';

const sectorsSchema = new mongoose.Schema({
  sectorName: {
    type: String,
    required: true,
    trim: true,
  },
  tollCollectionWastewater: [{
    type: String,
    trim: true
  }],
  chargeFeeBackgroundInfo: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('Sectors', sectorsSchema);