import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    
    asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
    
    actionType: {
        type: String,
        enum: [
            'created', 'updated', 'checked_out', 'checked_in',
            'maintenance', 'depreciated', 'custodian_changed',
            'retired', 'disposed'
        ],
        
        required: true
    },
    
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminAuth'},
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth'},
    
    date: { type: Date, default: Date.now },
    
    details: { type: String },

}, {
    timestamps: true
});

export default mongoose.model("History", historySchema);
