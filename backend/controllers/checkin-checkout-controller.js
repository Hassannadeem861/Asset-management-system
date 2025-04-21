import checkinCheckoutModel from "../models/checkin-checkout-model.js";
import assetModel from "../models/asset-model.js";



const checkinAsset = async (req, res) => {

    try {

        const { assetId } = req.params;
        const { checkInUser } = req.body;

        if (!assetId) {
            return res.status(400).json({ message: "asset ID is required" });
        }


        if (!checkInUser) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const asset = await assetModel.findById(assetId);

        if (!asset) {
            return res.status(404).json({ message: "Asset not found" });
        }

        if (String(asset.assignee) !== String(checkInUser)) {
            return res.status(403).json({ message: "You are not the assignee of this asset" });
        }

        const lastRecord = await checkinCheckoutModel.findOne({ asset: assetId }).sort({ createdAt: -1 });

        if (lastRecord && lastRecord.status === "checked-in") {
            return res.status(400).json({ message: "Asset is already assigned" });
        }


        const record = await checkinCheckoutModel.create({
            asset: assetId,
            checkInUser,
            status: "checked-in"
        })

        await assetModel.findByIdAndUpdate(assetId, { status: "in use" });

        return res.status(201).json({ message: "Checkin asset successfully", record });


    } catch (error) {
        return res.status(500).json({ message: "Check in creating error", errror: error.message });
    }
}

const checkoutAsset = async (req, res) => {

    try {

        const { assetId } = req.params;
        const { checkOutUser } = req.body;

        if (!assetId) {
            return res.status(400).json({ message: "asset ID is required" });
        }

        if (!checkOutUser) {
            return res.status(400).json({ message: "All fields are required" });
        }


        const asset = await assetModel.findById(assetId);
        console.log(asset.assignee);
        


        if (!asset) {
            return res.status(404).json({ message: "Asset not found" });
        }

        if (String(asset.assignee) !== String(checkOutUser)) {
            return res.status(403).json({ message: "You are not the assignee of this asset" });
        }

        const lastRecord = await checkinCheckoutModel.findOne({ asset: assetId }).sort({ createdAt: -1 });

        if (!lastRecord || lastRecord.status !== "checked-in") {
            return res.status(400).json({ message: "Cannot checkout. Asset is not checked in yet" });
        }

        const record = await checkinCheckoutModel.create({
            asset: assetId,
            checkOutUser,
            status: "checked-out"
        })

        await assetModel.findByIdAndUpdate(assetId, { status: "available", assignee: null, assignedBy: null });
        // await assetModel.findByIdAndDelete(asset.assignee);

        return res.status(201).json({ message: "Checkout asset successfully", record });


    } catch (error) {
        return res.status(500).json({ message: "Check out creating error", errror: error.message });
    }
}

const getCheckinCheckoutRecords = async (req, res) => {
    try {
        const records = await checkinCheckoutModel.find().populate('asset checkInUser checkOutUser')
            .sort({ createdAt: -1 });

        if (!records || records.length === 0) {
            return res.status(404).json({ message: "No records found" });
        }

        return res.status(200).json({ message: "Records fetched successfully", records });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching records", error: error.message });
    }
}

const getSingleCheckinCheckoutRecord = async (req, res) => {

    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Record ID is required" });
        }

        const record = await checkinCheckoutModel.findById(id).populate('asset checkInUser checkOutUser');

        if (!record) {
            return res.status(404).json({ message: "Record not found" });
        }

        return res.status(200).json({ message: "Single record fetched successfully", record });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching record", error: error.message });
    }
}

const updateCheckinCheckoutRecord = async (req, res) => {

    try {

        const { id } = req.params;

        const { checkInUser, checkOutUser } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Record ID is required" });
        }

        if (!checkInUser && !checkOutUser) {
            return res.status(400).json({ message: "At least one field is edit" });
        }

        const existingRecord = await checkinCheckoutModel.findById(id);

        if (!existingRecord) {
            return res.status(404).json({ message: "Record not found" });
        }


        const record = await checkinCheckoutModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!record) {
            return res.status(404).json({ message: "Record not found" });
        }

        return res.status(200).json({ message: "Record updated successfully", record });

    }
    catch (error) {
        return res.status(500).json({ message: "Error updating record", error: error.message });
    }
}

const deleteCheckinCheckoutRecord = async (req, res) => {

    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Record ID is required" });
        }

        const record = await checkinCheckoutModel.findByIdAndDelete(id);

        if (!record) {
            return res.status(404).json({ message: "Record not found" });
        }

        return res.status(200).json({ message: "Record deleted successfully" });

    }
    catch (error) {
        return res.status(500).json({ message: "Error deleting record", error: error.message });
    }
}



export { checkinAsset, checkoutAsset, getCheckinCheckoutRecords, getSingleCheckinCheckoutRecord, updateCheckinCheckoutRecord, deleteCheckinCheckoutRecord };