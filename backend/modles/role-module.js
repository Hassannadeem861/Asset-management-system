import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },  // e.g., "admin", "manager", "client"
    permissions: [{ type: String }]  // e.g., ['create', 'read', 'update', 'delete']
});

export default mongoose.model('Role', roleSchema);
