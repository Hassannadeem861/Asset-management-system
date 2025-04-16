import checkinCheckoutModel from "../models/checkin-checkout-model.js";
import assetModel from "../models/asset-model.js";



const checkinAsset = async (req, res) => {

    try {

        const { assetId } = req.params;
        const { checkInUser, checkInLocation } = req.body;

        if (!assetId) {
            return res.status(400).json({ message: "Checkin asset ID is required" });
        }


        if (!checkInUser || !checkInLocation) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const checkinAsset = await assetModel.findById(assetId);

        if (!checkinAsset) {
            return res.status(404).json({ message: "Asset not found" });
        }

        if (checkinAsset.status !== "available") {
            return res.status(400).json({ message: "Asset is not available for checkin" });
        }

        // Check if the asset is already checked in
        const existingCheckin = await checkinCheckoutModel.findOne({
            assetId: assetId,
            status: "checked-in"
        });

        if (existingCheckin) {
            return res.status(400).json({ message: "Asset is already checked in" });
        }

        const record = await checkinCheckoutModel.create({
            asset: assetId,
            checkInUser,
            checkInLocation,
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
        const { checkOutUser, checkOutLocation } = req.body;

        if (!assetId) {
            return res.status(400).json({ message: "asset ID is required" });
        }

        if (!checkOutUser || !checkOutLocation) {
            return res.status(400).json({ message: "All fields are required" });
        }


        const checkoutAsset = await assetModel.findById(assetId);

        if (!checkoutAsset) {
            return res.status(404).json({ message: "Asset not found" });
        }

        if (checkoutAsset.status !== "in use") {
            return res.status(400).json({ message: "Asset is not available for checkout" });
        }

        // Check if the asset is already checked out
        const existingCheckout = await checkinCheckoutModel.findOne({
            assetId: assetId,
            status: "checked-out"
        });

        if (existingCheckout) {
            return res.status(400).json({ message: "Asset is already checked out" });
        }

        const record = await checkinCheckoutModel.create({
            asset: assetId,
            checkOutUser,
            checkOutLocation,
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
        const records = await checkinCheckoutModel.find().populate('asset checkInUser checkInLocation checkOutUser checkOutLocation')
        // .sort({ createdAt: -1 });

        if (!records || records.length === 0) {
            return res.status(404).json({ message: "No records found" });
        }

        return res.status(200).json({ message: "Records fetched successfully", records });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching records", error: error.message });
    }
}

export { checkinAsset, checkoutAsset, getCheckinCheckoutRecords };