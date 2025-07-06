import mongoose from 'mongoose';

const runFix = async () => {
    await mongoose.connect('mongodb+srv://dopagraming:pYos44556uO9ky7x@test.g7mtqjx.mongodb.net/file-mengment?retryWrites=true&w=majority&appName=Test');

    const db = mongoose.connection.db;
    const collection = db.collection('sectors');

    // Step 1: Remove bad documents
    await collection.deleteMany({ sectorName: null });

    // Step 2: Drop the existing index (ignore if it doesn't exist)
    try {
        await collection.dropIndex('sectorName_1');
        console.log('Dropped existing sectorName_1 index');
    } catch (err) {
        console.log('No existing index to drop or already dropped:', err.message);
    }

    // Step 3: Recreate index with `sparse: true`
    try {
        await collection.createIndex(
            { sectorName: 1 },
            { unique: true, sparse: true }
        );
        console.log('Created sparse unique index on sectorName');
    } catch (err) {
        console.error('Error creating index:', err.message);
    }

    mongoose.disconnect();
};

runFix();
