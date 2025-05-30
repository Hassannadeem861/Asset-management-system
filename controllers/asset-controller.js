import assetModel from "../models/asset-model.js";
import userModel from "../models/user-auth-modle.js";
import adminModel from "../models/admin-auth-model.js";
import historyModel from "../models/history-model.js";
import mongoose from "mongoose";
import moment from 'moment';



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

            if (alreadyAssigned) return res.status(400).json({ message: "Asset already assigned to this user" });
        }

        const assetsToInsert = [];

        for (let i = 0; i < qua; i++) {
            const assigned = i === 0 && assignee;

            assetsToInsert.push({
                name,
                description,
                category,
                location,
                assignee: assigned ? assignee : null,
                purchaseDate,
                purchasePrice,
                status: assigned ? "in use" : "available",
                condition,
            });
        }

        const createdAssets = await assetModel.insertMany(assetsToInsert)

        const performedBy = req.admin;
        for (let asset of createdAssets) {
            await historyModel.create({
                asset: asset._id,
                actionType: 'created',
                performedBy,
                assignee,
                details: `Asset created${asset.assignee ? ' and assigned to user' : ''}.`
            });

            if (asset.assignee) {
                await historyModel.create({
                    asset: asset._id,
                    actionType: 'checked_in',
                    performedBy,
                    assignee,
                    details: `Asset assigned to user.`,
                });
            }
        }

        return res.status(201).json({ message: "Assets created", assets: createdAssets });
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [assets, stats] = await Promise.all([
            assetModel.find()
                .populate("location")
                .populate("category")
                .populate("assignee")
                .skip(skip)
                .limit(limit)
                .lean(),

            assetModel.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalAssets: { $sum: "$count" },
                        stats: {
                            $push: {
                                k: "$_id",
                                v: "$count"
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        stats: { $arrayToObject: "$stats" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalAssets: 1,
                        stats: 1
                    }
                }
            ])
        ]);

        if (!assets || assets.length === 0) {
            return res.status(404).json({ message: "No assets found" });
        }

        const summary = stats[0] || {
            totalAssets: 0,
            stats: {
                available: 0,
                'in use': 0,
                'Under repair': 0
            }
        };

        return res.status(200).json({
            message: "Assets fetched successfully",
            assets,
            totalAssets: summary.totalAssets,
            totalAvailableAssets: summary.stats.available || 0,
            totalInUseAssets: summary.stats['in use'] || 0,
            totalUnderRepairAssets: summary.stats['Under repair'] || 0,
            currentPage: page,
            totalPages: Math.ceil(summary.totalAssets / limit)
        });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching assets", error: error.message });
    }
};

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

        if (!name && !description && !category && !location && !purchaseDate && !purchasePrice) {
            return res.status(400).json({ message: "Atleast one field is required" });
        }

        const oldAsset = await assetModel.findById(id);
        if (!oldAsset) return res.status(404).json({ message: "Asset not found" });

        const updated = await assetModel.findByIdAndUpdate(id, {
            name, description, category, location, purchaseDate, purchasePrice, condition
        }, { new: true });

        await historyModel.create({
            asset: updated._id,
            actionType: 'updated',
            performedBy: req.userId,
            details: 'Asset updated.'
        });

        return res.status(200).json({ message: "Asset updated", asset: updated });

    } catch (error) {
        return res.status(500).json({ message: "Asset update failed", error: error.message });
    }
};

const updateCustodian = async (req, res) => {

    try {

        const { assetId } = req.params
        const { location, custodianName } = req.body

        if (!assetId) {
            return res.status(400).json({ message: "ASSET ID is required" });
        }

        if (!location && !custodianName) {
            return res.status(400).json({ message: "At least one field (location or custodianName) must be provided" });
        }

        const asset = await assetModel.findById(assetId)

        if (!asset) {
            return res.status(400).json({ message: "Asset not found" });
        }

        const updatedFields = {};
        if (location) updatedFields.location = location;
        if (custodianName) updatedFields.custodianName = custodianName;

        const updateCustodian = await assetModel.findByIdAndUpdate(
            assetId,
            updatedFields,
            { new: true }
        );
        return res.status(200).json({ message: "Custodian updated succesfully", updateCustodian });


    } catch (error) {
        return res.status(500).json({ message: "Error in update custodian", error: error.message });
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

const checkInAsset = async (req, res) => {
    try {

        const { assetId } = req.params;
        const { userId } = req.body;

        if (!assetId || !userId) {
            return res.status(400).json({ message: "Asset ID and User ID are required." });
        }

        const asset = await assetModel.findById(assetId);
        if (!asset) return res.status(404).json({ message: "Asset not found" });

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });


        if (asset.status === 'in use') {
            return res.status(400).json({ message: "Asset already in use." });
        }

        const today = moment().startOf('day');

        const alreadyCheckedIn = await historyModel.findOne({
            asset: assetId,
            actionType: 'checked_in',
            performedBy: req.admin,
            date: { $gte: today.toDate() }
        });

        if (alreadyCheckedIn) {
            return res.status(400).json({ message: "This asset has already been checked in by you today." });
        }

        asset.status = 'in use';
        asset.assignee = userId;
        await asset.save();

        await historyModel.create({
            asset: assetId,
            actionType: 'checked_in',
            performedBy: req.admin,
            assignee: userId,
            details: `Checked in by admin. Assigned to user ${userId}.`
        });

        return res.status(200).json({ message: "Asset checked in successfully." });

    } catch (err) {
        return res.status(500).json({ message: "Check-in failed", error: err.message });
    }
};

const checkOutAsset = async (req, res) => {

    try {

        const { assetId } = req.params;
        const { userId } = req.body;

        if (!assetId || !userId) {
            return res.status(400).json({ message: "Asset ID and User ID are required." });
        }

        const asset = await assetModel.findById(assetId);
        if (!asset) return res.status(404).json({ message: "Asset not found" });

        const user = await userModel.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });


        if (asset.assignee?.toString() !== userId?.toString()) {
            return res.status(403).json({ message: "You are not assigned to this asset." });
        }

        if (!asset || asset.status === 'available') {
            return res.status(404).json({ message: "Asset not found or already available" });
        }


        const today = moment().startOf('day');

        const alreadyCheckedOut = await historyModel.findOne({
            asset: assetId,
            actionType: 'checked_out',
            performedBy: req.admin,
            date: { $gte: today.toDate() }
        });

        if (alreadyCheckedOut) {
            return res.status(403).json({message: "This asset has already been checked out by you today."});
        }

        asset.status = 'available';
        asset.assignee = null;
        await asset.save();

        await historyModel.create({
            asset: assetId,
            actionType: 'checked_out',
            performedBy: req.admin,
            assignee: userId,
            details: "Asset checked out (unassigned)."
        });

        return res.status(200).json({ message: "Asset checked out successfully." });

    } catch (err) {
        return res.status(500).json({ message: "Check-out failed", error: err.message });
    }
};


export { createAsset, getAllAsset, getSingleAsset, updateAsset, updateCustodian, deleteAsset, getFilterData, searchAssets, uploadBulkAssets, checkInAsset, checkOutAsset };
