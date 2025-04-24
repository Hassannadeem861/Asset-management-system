import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
    asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
    checkin: { type: Date, default: null },
    checkout: { type: Date, default: null },
}, {
    timestamps: true
});

export default mongoose.model("History", historySchema);
