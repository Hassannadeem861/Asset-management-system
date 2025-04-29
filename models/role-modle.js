import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, enum: ['admin', 'user'],  default: "user" },
    permissions: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Role', roleSchema);
