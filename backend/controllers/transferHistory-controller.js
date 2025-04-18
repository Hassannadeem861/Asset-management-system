import transferHistoryModel from "../models/transferHistory-model.js";
import assetModel from "../models/asset-model.js";
import locationModel from "../models/location-model.js";
import userModel from "../models/user-auth-modle.js";
import adminModel from "../models/admin-auth-model.js";

const createTransfer = async (req, res) => {

    try {

        const { asset, fromLocation, toLocation, fromUser, toUser, assignedBy } = req.body;

        if (!asset || !fromLocation || !toLocation || !fromUser || !toUser || !assignedBy) {
            return res.status(400).json({
                message: "All fields (asset, fromLocation, toLocation, fromUser, toUser, assignedBy) are required to proceed with the transfer."
            });
        }

        const [assetDoc, fromLocDoc, toLocDoc, fromUserDoc, toUserDoc, assignedByDoc] = await Promise.all([
            assetModel.findById(asset),
            locationModel.findById(fromLocation),
            locationModel.findById(toLocation),
            userModel.findById(fromUser),
            userModel.findById(toUser),
            adminModel.findById(assignedBy)
        ]);


        if (!assetDoc) return res.status(404).json({ message: "Asset not found." });
        if (!fromLocDoc) return res.status(404).json({ message: "From location not found." });
        if (!toLocDoc) return res.status(404).json({ message: "To location not found." });
        if (!fromUserDoc) return res.status(404).json({ message: "From user not found." });
        if (!toUserDoc) return res.status(404).json({ message: "To user not found." });
        if (!assignedByDoc) return res.status(404).json({ message: "Admin not found." });

        if (String(fromUser) === String(toUser)) {
            return res.status(400).json({
                message: "Asset is already assigned to the user"
            });
        }

        if (assetDoc.status === "in use" || assetDoc.status === "Under repair") {
            return res.status(400).json({
                message: `Asset is not currently available because it is ${assetDoc.status}`
            });
        }

        const transferHistory = await transferHistoryModel.create({
            asset,
            fromLocation,
            toLocation,
            fromUser,
            toUser,
            assignedBy,
            transferDate: new Date()
        });

        // ✅ Update asset
        assetDoc.assignee = toUser;
        assetDoc.location = toLocation;
        assetDoc.status = "in use";
        await assetDoc.save();

        return res.status(201).json({
            message: "Asset transferred successfully and transfer history recorded.",
            transferHistory
        });
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

        console.log(id);

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