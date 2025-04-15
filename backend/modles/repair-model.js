import mongoose from 'mongoose';

const repairSchema = new mongoose.Schema({

    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    sendDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    cost: { type: Number, required: true },
    repairPlace: { type: String, required: true },
   

}, { timestamps: true });

export default mongoose.model('Repair', repairSchema);