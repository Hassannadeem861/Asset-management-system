import transferHistoryModel from "../models/transferHistory-model.js";
import assetModel from "../models/asset-model.js";

const createTransfer = async (req, res) => {
    try {

        const asset = req.params.id;

        const { fromLocation, toLocation, fromUser, toUser } = req.body;

        if (!asset) {
            return res.status(400).json({ message: "Asset ID is required" });
        }

        if (!fromLocation || !toLocation || !fromUser || !toUser) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const checkAsset = await assetModel.findById(asset);

        if (!checkAsset) {
            return res.status(404).json({ message: "Asset not found" });
        }

        // 🚨 Prevent transferring to same user and same location
        if (fromUser === toUser) {
            return res.status(400).json({
                message: "Asset is already assigned to this user"
            });
        }

        if (checkAsset.status !== "available") {
            return res.status(400).json({ message: "Asset is not available for transfer" });
        }

        const transferHistory = await transferHistoryModel.create({
            asset,
            fromLocation,
            toLocation,
            fromUser,
            toUser,
            transferDate: new Date()
        });

        checkAsset.assignee = toUser;
        checkAsset.location = toLocation;
        checkAsset.status = "in use";
        await checkAsset.save();

        return res.status(201).json({ message: "Transfer history created successfully", transferHistory });
    } catch (error) {
        return res.status(500).json({ message: "Error creating transfer history", error: error.message });
    }
}

const getAllTransfers = async (req, res) => {
    try {
        const transfers = await transferHistoryModel.find()
            .populate("asset")
            .populate("fromUser")
            .populate("toUser")
            .populate("fromLocation")
            .populate("toLocation");

        if (!transfers || transfers.length === 0) {
            return res.status(404).json({ message: "No transfer history found" });
        }

        return res.status(200).json({ message: "All transfer history", transfers });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching transfers", error: error.message });
    }
};

const getTransferById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Transfer ID is required" });
        }

        const transfer = await transferHistoryModel.findById(id)
            .populate("asset")
            .populate("fromUser")
            .populate("toUser")
            .populate("fromLocation")
            .populate("toLocation");

        if (!transfer) {
            return res.status(404).json({ message: "Transfer history not found" });
        }

        return res.status(200).json({ message: "Transfer history found", transfer });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching transfer history", error: error.message });
    }
};

const updateTransfer = async (req, res) => {
    try {
        const { id } = req.params;
        const { asset, fromLocation, toLocation, fromUser, toUser, transferDate } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Transfer ID is required" });
        }

        const updatedTransferHistory = await transferHistoryModel.findByIdAndUpdate(id, {
            asset,
            fromLocation,
            toLocation,
            fromUser,
            toUser,
            transferDate
        }, { new: true });

        if (!updatedTransferHistory) {
            return res.status(404).json({ message: "Transfer history not found" });
        }

        return res.status(200).json({ message: "Transfer history updated successfully", data: updatedTransferHistory });

    } catch (error) {
        return res.status(500).json({ message: "Error updating transfer history", error: error.message });
    }
}

const deleteTransfer = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Transfer ID is required" });
        }

        const deletedTransferHistory = await transferHistoryModel.findByIdAndDelete(id);

        if (!deletedTransferHistory) {
            return res.status(404).json({ message: "Transfer history not found" });
        }

        return res.status(200).json({ message: "Transfer history deleted successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Error deleting transfer history", error: error.message });
    }
}

export {
    createTransfer,
    getAllTransfers,
    getTransferById,
    updateTransfer,
    deleteTransfer
}