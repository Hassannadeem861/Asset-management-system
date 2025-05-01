import HistoryModel from "../models/history-model.js";
import assetModel from "../models/asset-model.js";
import historyModel from "../models/history-model.js";

const getAllHistory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [total, history] = await Promise.all([
            HistoryModel.countDocuments(),
            HistoryModel.find()
                .populate("performedBy", "_id name email role")
                .populate("asset")
                .populate("assignee")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
        ]);

        if (!history.length) {
            return res.status(404).json({ message: "No history records found" });
        }

        return res.status(200).json({
            message: "History records fetched successfully",
            history,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        });

    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch history", error: error.message });
    }
};

const getSingleHistory = async (req, res) => {
    try {
        const history = await HistoryModel.findById(req.params.id)
            .populate("performedBy", "_id name email role")
            .populate("asset")
            .populate("assignee")
            .lean();

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
        const { assetId } = req.params;

        if (!assetId) {
            return res.status(400).json({ message: "Asset ID is required" });
        }

        const historyRecords = await HistoryModel.find({ asset: assetId })
            .populate("performedBy", "_id name email role")
            .populate("asset", "name description location category assignee purchaseDate purchasePrice status condition")
            .populate("assignee")
            .sort({ createdAt: -1 })
            .lean();

        if (!historyRecords.length) {
            return res.status(404).json({ message: "No history found for this asset" });
        }

        res.status(200).json({
            message: "Single asset history fetched successfully",
            count: historyRecords.length,
            history: historyRecords
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch asset history", error: error.message });
    }
};


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
