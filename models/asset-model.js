import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({

    name: { type: String, required: true, index: true },
    description: { type: String, index: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true, index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', index: true },
    purchaseDate: { type: Date, required: true },
    purchasePrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ['available', 'in use', 'Under repair', 'retired', 'disposed'],
        default: 'available',
        index: true
    },
    condition: { type: String, enum: ['new', 'used', 'damaged'], default: 'new' }
}, { timestamps: true });

export default mongoose.model('Asset', assetSchema);