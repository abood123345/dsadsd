import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    // required: true,
    trim: true
  },
  workNumber: {
    type: String,
    // required: true,
    trim: true
  },
  senderTo: {
    type: String,
    // required: true,
    trim: true
  },
  payerNumber: {
    type: String,
    // required: true,
    trim: true
  },
  email: {
    type: String,
    // required: true,
    trim: true,
    lowercase: true
  },
  factoryAddress: {
    type: String,
    // required: true,
    trim: true
  },
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CouncilsAndCompanies',
    // required: true
  },
  sectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sectors',
    // required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Business', businessSchema);