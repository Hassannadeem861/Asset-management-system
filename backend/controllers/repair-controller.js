import repairModel from "../models/repair-model.js";
import assetModel from "../models/asset-model.js";


const createRepair = async (req, res) => {
    try {

        const { asset, sendDate, repairPlace, cost } = req.body;

        if (!asset || !sendDate || !repairPlace || !cost) {
            return res.status(400).json({
                message: "All fields (asset, sendDate, repairPlace, cost) are required to proceed with the repair."
            });
        }

        const checkAssetId = await assetModel.findById(asset);

        if (!checkAssetId) {
            return res.status(404).json({ message: "Asset not found" });
        }

        if (checkAssetId.status === "Under repair") {
            return res.status(400).json({ message: "This asset is already under repair." });
        }

        const newRepair = await repairModel.create({
            asset,
            sendDate,
            repairPlace,
            cost,
        });


        checkAssetId.status = "Under repair";
        await checkAssetId.save();

        return res.status(201).json({ message: "Repair created successfully", data: newRepair });
    } catch (error) {
        return res.status(500).json({ message: "Error creating repair", error: error.message });
    }
}

const getAllRepairs = async (req, res) => {
    try {
        const repairs = await repairModel.find().populate([
            {
                path: "asset",
                select: "name description assignee assignedBy purchaseDate purchasePrice status condition category location",
                populate: [
                    {
                        path: "category",
                        select: "_id name"
                    },
                    {
                        path: "location",
                        select: "_id name address"
                    },
                    {
                        path: "assignee",
                        select: "_id username cnic phone"
                    },
                    {
                        path: "assignedBy",
                        select: "_id name email role"
                    }
                ]
            }
        ]);

        return res.status(200).json({
            message: "Repair records fetched successfully",
            count: repairs.length,
            repairs
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong while fetching repair records.",
            error: error.message
        });
    }
};

const getRepairById = async (req, res) => {

    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Repair ID is required" });
        }

        const repair = await repairModel.findById(id).populate([
            {
                path: "asset",
                select: "name description assignee assignedBy purchaseDate purchasePrice status condition category location",
                populate: [
                    {
                        path: "category",
                        select: "_id name"
                    },

                    {
                        path: "location",
                        select: "_id name address"
                    },

                    {
                        path: "assignedBy",
                        select: "_id name email role"
                    },

                    {
                        path: "assignee",
                        select: "_id username cnic phone"
                    }

                ]
            }
        ]);


        return res.status(200).json({ message: "Repair record found", count: repair.length, repair });

    } catch (error) {
        return res.status(500).json({ message: "Error getting repair record", error: error.message });
    }
};

const updateRepair = async (req, res) => {

    try {

        const { id } = req.params;

        const { returnDate } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Repair ID is required" });
        }

        if (!returnDate) {
            return res.status(400).json({ message: "Return date is required" });;
        }

        const repair = await repairModel.findById(id);
        console.log(repair.asset);

        if (!repair) {
            return res.status(404).json({ message: "Repair not found" });
        }

        repair.returnDate = returnDate;
        repair.status = "completed";
        await repair.save();

        await assetModel.findByIdAndUpdate(repair.asset, {
            status: "available"
        });

        return res.status(200).json({ message: "Repair updated successfully", repair });

    } catch (error) {
        return res.status(500).json({ message: "Error updating repair", error: error.message });
    }
};

const deleteRepair = async (req, res) => {

    try {
        const { id } = req.params;

        const repair = await repairModel.findByIdAndDelete(id);

        if (!id) {
            return res.status(400).json({ message: "Repair ID is required" });
        }

        if (!repair) {
            return res.status(404).json({ message: "Repair not found" });
        }

        return res.status(200).json({ message: "Repair deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting repair", error: error.message });
    }
};

export { createRepair, getAllRepairs, getRepairById, updateRepair, deleteRepair };