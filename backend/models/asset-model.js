import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({

    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth' },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth' },
    purchaseDate: { type: Date, required: true },
    purchasePrice: { type: Number, required: true },
    qrCode: { type: String, required: true, unique: true },
    status: { type: String, enum: ['available', 'in use', 'Under repair'], default: 'available' },
    condition: { type: String, enum: ['new', 'used', 'damaged'], default: 'new' },


}, { timestamps: true });

export default mongoose.model('Asset', assetSchema);