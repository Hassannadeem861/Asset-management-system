import checkinCheckoutModel from "../modles/checkin-checkout-model.js";
import assetModel from "../modles/asset-model.js";



const checkinAsset = async (req, res) => {

    try {

        const { checkinAssetId } = req.params;
        const { checkInDate, checkInUser, checkInLocation } = req.body;

        if (!checkinAssetId) {
            return res.status(400).json({ message: "Checkin asset ID is required" });
        }


        if (!checkInDate || !checkInUser || !checkInLocation) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const checkinAsset = await assetModel.findById(checkinAssetId);

        if (!checkinAsset) {
            return res.status(404).json({ message: "Asset not found" });
        }

        const record = await checkinCheckoutModel.create({
            asset: checkinAssetId,
            checkInDate,
            checkInUser,
            checkInLocation,
            status: "checked-in"
        })


        await assetModel.findByIdAndUpdate(checkinAssetId, { status: "in use" });

        return res.status(201).json({ message: "Checkin asset successfully", record });


    } catch (error) {
        return res.status(500).json({ message: "Check in creating error", errror: error.message });
    }
}


const checkoutAsset = async (req, res) => {

    try {

        const { checkoutAssetId } = req.params;
        const { checkOutDate, checkOutUser, checkOutLocation } = req.body;

        if (!checkoutAssetId) {
            return res.status(400).json({ message: "Checkout asset ID is required" });
        }

        if (!checkOutDate || !checkOutUser || !checkOutLocation) {
            return res.status(400).json({ message: "All fields are required" });
        }


        const checkoutAsset = await assetModel.findById(checkoutAssetId);

        if (!checkoutAsset) {
            return res.status(404).json({ message: "Asset not found" });
        }

        const record = await checkinCheckoutModel.findOneAndUpdate(
            { checkoutAssetId, status: "checked-out" },
            {
                checkOutUser,
                checkOutDate,
                checkOutLocation,
                status: "checked-out"
            },
            { new: true }
        );

        await assetModel.findByIdAndUpdate(checkoutAssetId, { status: "available" });


        return res.status(201).json({ message: "Checkout asset successfully", record });


    } catch (error) {
        return res.status(500).json({ message: "Check out creating error", errror: error.message });
    }
}

const getCheckinCheckoutRecords = async (req, res) => {
    try {
        const records = await checkinCheckoutModel.find().populate('asset checkInUser checkInDate checkInLocation checkOutUser checkOutDate checkOutLocation').sort({ createdAt: -1 });
       
        if (!records || records.length === 0) {
            return res.status(404).json({ message: "No records found" });
        }

        return res.status(200).json({ message: "Records fetched successfully", records });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching records", error: error.message });
    }
}