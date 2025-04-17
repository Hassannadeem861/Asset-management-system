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
            return res.status(400).json({ message: "Asset is already checked in" });
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

        await assetModel.findByIdAndUpdate(assetId, { status: "available" });
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

export { checkinAsset, checkoutAsset, getCheckinCheckoutRecords };