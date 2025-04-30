import mongoose from "mongoose";

const historySchema = new mongoose.Schema({

    asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },

    actionType: {
        type: String,
        enum: [
            'created', 'updated', 'checked_out', 'checked_in',
            'under_repair', 'repair_completed', 'custodian_changed'
        ],

        required: true
    },

    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminAuth' },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth' },

    date: { type: Date, default: Date.now },

    details: { type: String },

}, {
    timestamps: true
});

export default mongoose.model("History", historySchema);
