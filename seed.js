import mongoose from 'mongoose';
import data from './data/businesses.js';
import CouncilsAndCompanies from './models/Business.js';

// Connect to MongoDB
await mongoose.connect('mongodb+srv://dopagraming:pYos44556uO9ky7x@test.g7mtqjx.mongodb.net/file-mengment?retryWrites=true&w=majority&appName=Test');

// Clean old data (optional)
await CouncilsAndCompanies.deleteMany({});

// Insert data
await CouncilsAndCompanies.insertMany(data);

console.log('✅ Data seeded successfully!');

// Disconnect
await mongoose.disconnect();
