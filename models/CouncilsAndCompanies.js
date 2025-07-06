import mongoose from 'mongoose';

const councilsAndCompaniesSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['corporation', 'council'],
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  signature: {
    type: String,
    trim: true
  },
  copies: {
    type: String,
    trim: true
  },
  yearsofmonitoring: {
    type: String,
    trim: true
  },
  wordfilenoticeletter: {
    type: String, // File path
    default: null
  },
  wordfileboth: {
    type: String, // File path
    default: null
  },
  wordfileunusualwastewater: {
    type: String, // File path
    default: null
  },
  wordfileforbiddenwastewater: {
    type: String, // File path
    default: null
  },
  wordfilepaymentletter: {
    type: String, // File path
    default: null
  },
  labName: {
    type: String,
    trim: true
  },
  mts: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

export default mongoose.model('CouncilsAndCompanies', councilsAndCompaniesSchema);