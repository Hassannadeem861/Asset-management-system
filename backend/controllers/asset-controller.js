import assetModel from "../models/asset-model.js";
import userModel from "../models/auth-modle.js";

const createAsset = async (req, res) => {
    try {

        const { name, description, category, location, assignee, assignedBy, purchaseDate, purchasePrice, qrCode, status, condition } = req.body;

        if (!name || !description || !category || !location || !purchaseDate || !purchasePrice || !qrCode) {
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
            qrCode,
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

const updateAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, location, purchaseDate, purchasePrice, qrCode, status, condition } = req.body;

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
            qrCode,
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

        const checkAssetId = await assetModel.findById(id).populate("assignee");
        console.log("checkAssetId", checkAssetId.assignee.username);


        if (!checkAssetId) {
            return res.status(404).json({ message: "Asset not found" });
        }

        
        if (checkAssetId.status === "in use") {
            let currentUserName = checkAssetId?.assignee?.username || "unknown";
            return res.status(400).json({ message: `Asset already assigned to ${currentUserName}` });
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





export { createAsset, getAllAsset, getSingleAsset, updateAsset, deleteAsset, assignAsset };