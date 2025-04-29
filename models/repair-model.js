import mongoose from 'mongoose';

const repairSchema = new mongoose.Schema({

    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    sendDate: { type: Date, required: true },
    returnDate: { type: Date, required: false },
    cost: { type: Number, required: true },
    repairPlace: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
   

}, { timestamps: true });

export default mongoose.model('Repair', repairSchema);