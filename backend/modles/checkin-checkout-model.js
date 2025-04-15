import mongoose from 'mongoose';

const checkInCheckOutSchema = new mongoose.Schema({

    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    checkInUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    checkOutUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    checkInLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    checkOutLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    status: { type: String, enum: ['checked-in', 'checked-out'], default: 'checked-out' },


}, { timestamps: true });

export default mongoose.model('CheckInCheckOut', checkInCheckOutSchema);