import mongoose from 'mongoose';

const transferHistorySchema = new mongoose.Schema({

    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    fromLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    toLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
    transferDate: { type: Date, required: true },



}, { timestamps: true });

export default mongoose.model('TransferHistory', transferHistorySchema);