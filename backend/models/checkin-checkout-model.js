import mongoose from 'mongoose';

const checkInCheckOutSchema = new mongoose.Schema({

    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' },
    checkInUser: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth' },
    checkOutUser: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth' },
    status: { type: String, enum: ['checked-in', 'checked-out'], default: 'checked-out' },
    

}, { timestamps: true });

export default mongoose.model('CheckInCheckOut', checkInCheckOutSchema);