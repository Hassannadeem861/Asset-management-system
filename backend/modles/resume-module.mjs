import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    candidateName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    experience: { type: String, required: true },
    education: { type: String, required: true },
    skills: { type: [String], required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth' },  // Reference to User who created this resume
    resumeImage: {
        type: String,
        required: true
    }


}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);
