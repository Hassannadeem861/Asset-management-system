import assetModel from "../models/asset-model.js";
import userModel from "../models/user-auth-modle.js";
import adminModel from "../models/admin-auth-model.js";
import historyModel from "../models/history-model.js";
import mongoose from "mongoose";




const createAsset = async (req, res) => {

    try {
        const {
            name, description, category, location,
            assignee, purchaseDate, purchasePrice,
            condition, quantity
        } = req.body;

        const qua = quantity ? quantity : 1;

        if (!name || !description || !category || !location || !purchaseDate || !purchasePrice || !condition) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let user = null;

        if (assignee) {
            user = await userModel.findById(assignee);
            if (!user) return res.status(404).json({ message: "Assignee user not found" });

            const alreadyAssigned = await assetModel.findOne({ assignee })
            console.log();

            if (alreadyAssigned) return res.status(400).json({ message: "Asset already assigned to this user" });
        }

        const assetsToInsert = [];

        for (let i = 0; i < qua; i++) {
            const isFirstAsset = i === 0 && assignee;

            assetsToInsert.push({
                name,
                description,
                category,
                location,
                assignee: isFirstAsset ? assignee : null,
                purchaseDate,
                purchasePrice,
                status: isFirstAsset ? "in use" : "available",
                condition
            });
        }

        const insertedAssets = await assetModel.insertMany(assetsToInsert)

        if (assignee) {
            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));

            const existingCheckin = await historyModel.findOne({
                user: assignee,
                asset: insertedAssets[0]._id,
                checkin: { $gte: startOfDay }
            });

            if (!existingCheckin) {
                await historyModel.create({
                    user: assignee,
                    asset: insertedAssets[0]._id,
                    checkin: new Date()
                });
            }
        }

        return res.status(201).json({
            message: "Asset created successfully",
            asset: insertedAssets
        });

    } catch (error) {
        return res.status(500).json({
            message: "Asset creation failed",
            error: error.message
        });
    }
};

const uploadBulkAssets = async (req, res) => {

    try {

        const assets = req.body;

        if (!Array.isArray(req.body) || req.body.length === 0) {
            return res.status(400).json({ message: "Please provide an array of assets" });
        }

        const createAssets = assets.map((asset) => {
            const {
                name,
                description,
                category,
                location,
                assignee,
                purchaseDate,
                purchasePrice,
                condition,
                status
            } = asset

            if (!name || !description || !category || !location || !purchaseDate || !purchasePrice || !condition) {
                throw new Error("Missing required fields in one or more assets.");
            }

            return {
                name,
                description,
                category,
                location,
                assignee: assignee || null,
                purchaseDate,
                purchasePrice,
                status,
                condition
            }


        });

        const createdAssets = await assetModel.insertMany(createAssets);

        return res.status(201).json({
            message: "Assets uploaded successfully",
            createdAssets
        });


    } catch (error) {

        return res.status(500).json({ message: "Error uploading bulk assets", error: error.message });

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
            .skip(skip)
            .limit(limit)

        if (!assets || assets.length === 0) {
            return res.status(404).json({ message: "No asset found" })
        }

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

        const asset = await assetModel.findById(id).populate("location").populate("category").populate("assignee")

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
        const {
            name, description, category, location,
            purchaseDate, assignee, purchasePrice, condition
        } = req.body;

        if (!name || !description || !category || !location || !purchaseDate || !purchasePrice) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const oldAsset = await assetModel.findById(id);
        if (!oldAsset) return res.status(404).json({ message: "Asset not found" });

        if (oldAsset.assignee && (!assignee || oldAsset.assignee.toString() !== assignee)) {
            await historyModel.findOneAndUpdate(
                {
                    user: oldAsset.assignee,
                    asset: id,
                    checkout: null
                },
                { checkout: new Date() }
            );
        }

        if (assignee) {
            const user = await userModel.findById(assignee);
            if (!user) return res.status(404).json({ message: "Assignee user not found" });

            const alreadyAssigned = await assetModel.findOne({ assignee });
            if (alreadyAssigned && alreadyAssigned._id.toString() !== id) {
                return res.status(400).json({ message: "Asset already assigned to this user" });
            }

            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const existingCheckin = await historyModel.findOne({
                user: assignee,
                asset: id,
                checkin: { $gte: startOfDay }
            });

            if (!existingCheckin) {
                await historyModel.create({
                    user: assignee,
                    asset: id,
                    checkin: new Date()
                });
            }

            // await userModel.findByIdAndUpdate(assignee, { status: "checkin" });
        }

        const updatedAsset = await assetModel.findByIdAndUpdate(
            id,
            {
                name,
                description,
                category,
                location,
                purchaseDate,
                purchasePrice,
                condition,
                assignee: assignee || null,
                status: assignee ? "in use" : "available",
            },
            { new: true }
        );

        return res.status(200).json({ message: "Asset updated successfully", asset: updatedAsset });

    } catch (error) {
        return res.status(500).json({ message: "Asset update failed", error: error.message });
    }
};

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

const checkInAsset = async (req, res) => {
    try {

        const { assetId } = req.params

        const { userId } = req.body

        if (!assetId || !userId) {
            return res.status(400).json({ message: "Asset ID and User ID are required" });
        }

        await historyModel.create({
            asset: assetId,
            user: userId,
            checkin: new Date()
        })

        await assetModel.findByIdAndUpdate(assetId, {
            assignee: userId,
            status: "in use"
        })


        return res.status(200).json({ message: "Asset checked in successfully" });

    } catch (error) {

        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

const checkOutAsset = async (req, res) => {
    try {
        const { assetId } = req.params;
        
        const { userId } = req.body;

        if (!assetId || !userId) {
            return res.status(400).json({ message: "Asset ID and User ID are required" });
        }

        const history = await historyModel.findOneAndUpdate(
            {
                asset: assetId,
                user: userId,
                checkout: null
            },
            {
                checkout: new Date()
            }
        );

        if (!history) {
            return res.status(404).json({ message: "No active check-in found for this asset and user" });
        }

        await assetModel.findByIdAndUpdate(assetId, {
            assignee: null,
            status: "available"
        });

        return res.status(200).json({ message: "Asset checked out successfully" });

    } catch (error) {
        console.error("Check-out error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export { createAsset, getAllAsset, getSingleAsset, updateAsset, deleteAsset, getFilterData, searchAssets, uploadBulkAssets, checkInAsset, checkOutAsset };