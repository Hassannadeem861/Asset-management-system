import HistoryModel from "../models/history-model.js";
import assetModel from "../models/asset-model.js";
import historyModel from "../models/history-model.js";


const getAllHistory = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await HistoryModel.countDocuments();

        const history = await HistoryModel.find()
            .populate("user")
            .populate("asset")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            message: "History records fetched successfully",
            history,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch history", error: error.message });
    }
};

const getSingleHistory = async (req, res) => {
    try {

        const history = await HistoryModel.findById(req.params.id)
            .populate("user")
            .populate("asset");

        if (!history) {
            return res.status(404).json({ message: "History not found" });
        }

        return res.status(200).json({ message: "History found", history });
    } catch (error) {
        return res.status(500).json({ message: "Failed to get history", error: error.message });
    }
};

const getSingleAssetHistory = async (req, res) => {

    try {

        const { assetId } = req.params

        if (!assetId) {
            return res.status(400).json({ message: "Asset ID is required" });
        }

        const historyRecords = await historyModel.find({ asset: assetId })
            .populate({
                path: "user",
                select: "username email cnic phone address role status"
            })
            .populate({
                path: "asset",
                select: "name description location category assignee purchaseDate purchasePrice status condition"
            })

        if (!historyRecords.length) {
            return res.status(404).json({ message: "No history found for this asset" });
        }

        return res.status(200).json({
            message: "Single asset history fetched successfully",
            count: historyRecords.length,
            history: historyRecords
        });


    } catch (error) {
        return res.status(500).json({ message: "Error get single history", error: error.message });

    }
}

const deleteHistory = async (req, res) => {
    try {

        const deleted = await HistoryModel.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "History record not found" });
        }

        return res.status(200).json({ message: "History deleted successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Failed to delete history", error: error.message });
    }
};

export { getAllHistory, getSingleHistory, getSingleAssetHistory, deleteHistory }
