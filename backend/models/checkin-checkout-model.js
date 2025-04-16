import mongoose from 'mongoose';

const checkInCheckOutSchema = new mongoose.Schema({

    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' },
    checkInUser: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth' },
    checkOutUser: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth' },
    checkInLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    checkOutLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location',},
    status: { type: String, enum: ['checked-in', 'checked-out'], default: 'checked-out' },


}, { timestamps: true });

export default mongoose.model('CheckInCheckOut', checkInCheckOutSchema);