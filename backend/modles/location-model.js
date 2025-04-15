import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({

    name: { type: String, required: true, unique: true, index: true },
    city: { type: String, required: true,},
    address: { type: String, required: true },

}, { timestamps: true });

export default mongoose.model('Location', locationSchema);