import mongoose from 'mongoose';

const componentSchema = new mongoose.Schema({
  componentName: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: Number,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  }
});

const testedComponentsSchema = new mongoose.Schema({
  sectorName: {
    type: String,
    required: true,
    trim: true
  },
  components: [componentSchema]
}, {
  timestamps: true
});

export default mongoose.model('TestedComponents', testedComponentsSchema);