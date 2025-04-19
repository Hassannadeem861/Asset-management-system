import assetModel from "../models/asset-model.js";
import userModel from "../models/user-auth-modle.js";
import adminModel from "../models/admin-auth-model.js";
import mongoose from "mongoose";

const createAsset = async (req, res) => {
    try {

        const { name, description, category, location, assignee, assignedBy, purchaseDate, purchasePrice, status, condition } = req.body;

        if (!name || !description || !category || !location || !purchaseDate || !purchasePrice || !condition) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        const asset = await assetModel.create({
            name,
            description,
            category,
            location,
            assignee,
            assignedBy,
            purchaseDate,
            purchasePrice,
            status,
            condition
        });

        return res.status(201).json({ message: "Asset created successfully", asset });

    } catch (error) {
        return res.status(500).json({ message: "Error creating asset", error: error.message });
    }
}

const getAllAsset = async (req, res) => {

    try {

        const page = req.query.page || 1;

        const limit = req.query.limit || 10;

        const skip = (page - 1) * limit;

        const assets = await assetModel.find()
            .populate("location")
            .populate("category")
            .populate("assignee")
            .populate("assignedBy")
            .skip(skip)
            .limit(limit);



        const totalAssets = await assetModel.countDocuments();

        const totalAvailableAssets = await assetModel.countDocuments({ status: "available" });
        const totalInUseAssets = await assetModel.countDocuments({ status: "in use" });
        const totalUnderRepairAssets = await assetModel.countDocuments({ status: "Under repair" });

        return res.status(200).json({
            message: "Fetch all asset successfully",
            assets,
            totalAssets,
            totalAvailableAssets,
            totalInUseAssets,
            totalUnderRepairAssets,
            currentPage: page,
            totalPages: Math.ceil(totalAssets / limit)
        });

    } catch (error) {
        return res.status(500).json({ message: "Error creating asset", error: error.message });
    }
}

const getSingleAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const asset = await assetModel.findById(id).populate("location").populate("category").populate("assignee").populate("assignedBy");

        if (!asset) {
            return res.status(404).json({ message: "Asset not found" });
        }

        return res.status(200).json({ message: "Fetch single asset successfully", asset });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching asset", error: error.message });
    }
}

const getFilterData = async (req, res) => {

    try {

        const { location, category, status } = req.query;

        const filter = {};

        if (location && mongoose.Types.ObjectId.isValid(location)) {
            filter.location = location;
        }

        if (category && mongoose.Types.ObjectId.isValid(category)) {
            filter.category = category;
        }

        if (status) filter.status = status

        const assets = await assetModel.find(filter).populate("location").populate("category");

        if (assets.length === 0) {
            return res.status(404).json({ message: "No asset found" });
        }


        return res.status(200).json({ message: "Fetch filtered asset successfully", assets });


    } catch (error) {

        return res.status(500).json({ message: "Error fetching asset", error: error.message });
    }

}

const searchAssets = async (req, res) => {
    try {
        const { keyword, category, location, status, page = 1, limit = 10 } = req.query;

        const filter = {};

        // 🔍 Keyword search (name ya description)
        if (keyword) {
            filter.$or = [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ];
        }

        // ✅ Category filter
        if (category) filter.category = category;

        // ✅ Location filter
        if (location) filter.location = location;

        // ✅ Status filter
        if (status) filter.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const assets = await assetModel
            .find(filter)
            .populate("category", "_id name")
            .populate("location", "_id name address")
            .populate("assignee", "_id username")
            .populate("assignedBy", "_id name role")
            .skip(skip)
            .limit(parseInt(limit));

        const total = await assetModel.countDocuments(filter);

        if (assets.length === 0) {
            return res.status(404).json({ message: "No assets found" });
        }

        res.status(200).json({
            message: "Assets fetched successfully",
            data: assets,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error searching assets", error: error.message });
    }
};

const updateAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, location, purchaseDate, purchasePrice, status, condition } = req.body;

        if (!name || !description || !category || !location || !purchaseDate || !purchasePrice || !qrCode) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        const asset = await assetModel.findByIdAndUpdate(id, {
            name,
            description,
            category,
            location,
            purchaseDate,
            purchasePrice,
            status,
            condition
        }, { new: true });

        if (!asset) {
            return res.status(404).json({ message: "Asset not found" });
        }

        return res.status(200).json({ message: "Asset updated successfully", asset });

    }
    catch (error) {
        return res.status(500).json({ message: "Error updating asset", error: error.message });
    }
}

const deleteAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const asset = await assetModel.findByIdAndDelete(id);

        if (!asset) {
            return res.status(404).json({ message: "Asset not found" });
        }

        return res.status(200).json({ message: "Asset deleted successfully" });

    }
    catch (error) {
        return res.status(500).json({ message: "Error deleting asset", error: error.message });
    }
}

const assignAsset = async (req, res) => {

    try {

        const id = req.params.id;
        const { assignee, assignedBy } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Please provide asset ID" });
        }

        if (!assignee || !assignedBy) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        const checkUser = await userModel.findById(assignee);

        if (!checkUser) {
            return res.status(404).json({ message: "First, register yourself as an admin." });
        }

        const checkAssignedBy = await adminModel.findById(assignedBy);

        if (!checkAssignedBy) {
            return res.status(404).json({ message: "AssignedBy user not found" });
        }

        const checkAssetId = await assetModel.findById(id).populate("assignee").populate("assignedBy");
        console.log("checkAssetId", checkAssetId);

        if (!checkAssetId) {
            return res.status(404).json({ message: "Asset not found" });
        }


        if (checkAssetId.assignee) {
            let currentUserName = checkAssetId?.assignee?._id || "unknown";
            return res.status(400).json({ message: `Asset already assigned to ${currentUserName}` });
        }


        if (checkAssetId.status === "in use") {
            return res.status(400).json({ message: `Asset already assigned` });
        }

        const asset = await assetModel.findByIdAndUpdate(id, {
            assignee,
            assignedBy,
        }, { new: true });

        if (!asset) {
            return res.status(404).json({ message: "Asset not found" });
        }



        return res.status(200).json({ message: `Asset assigned successfully`, asset });

    } catch (error) {
        return res.status(500).json({ message: "Error assigning asset", error: error.message });

    }
}





export { createAsset, getAllAsset, getSingleAsset, updateAsset, deleteAsset, assignAsset, getFilterData, searchAssets };