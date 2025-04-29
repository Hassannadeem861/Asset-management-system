import locationModel from "../models/location-model.js";


const createLocation = async (req, res) => {
    try {

        const { name, address, city } = req.body;

        if (!name || !address || !city) {
            return res.status(400).json({ message: "Please provide location name, address and city" });
        }

        const location = await locationModel.create(req.body);

        return res.status(201).json({ message: "Location created successfully", location });

    } catch (error) {
        return res.status(500).json({ message: "Error creating location", error: error.message });
    }
}

const getAllLocation = async (req, res) => {

    try {

        const page = req.query.page || 1;

        const limit = req.query.limit || 10;

        const skip = (page - 1) * limit;

        const locations = await locationModel.find().skip(skip).limit(limit);

        const totalLocations = await locationModel.countDocuments();


        return res.status(201).json({ message: "Fetch all location successfully", locations, totalLocations, currentPage: page, totalPages: Math.ceil(totalLocations / limit) });

    } catch (error) {
        return res.status(500).json({ message: "Error creating location", error: error.message });
    }
}

const getSingleLocation = async (req, res) => {

    try {

        const { id } = req.params;

        const location = await locationModel.findById(id)

        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        return res.status(200).json({ message: "Fetch single location successfully", location });

    } catch (error) {

        return res.status(500).json({ message: "Error fetching location", error: error.message });
    }
}

const updateLocation = async (req, res) => {
    try {

        const { id } = req.params;

        const { name, city, address } = req.body;

        if (!name && !city && !address) {
            return res.status(400).json({ message: "At least one field is edit" });
        }

        const location = await locationModel.findById(id);

        if (!location) return res.status(404).json({ message: "Category not found" });

        const updatedLocation = await locationModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        return res.status(200).json({ message: "Location updated successfully", updatedLocation });

    } catch (error) {
        return res.status(500).json({ message: "Location update failed", error: error.message });
    }
};

const deleteLocation = async (req, res) => {
    try {

        const { id } = req.params;

        const location = await locationModel.findByIdAndDelete(id);

        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        return res.status(200).json({ message: "Location deleted successfully" });

    }

    catch (error) {

        return res.status(500).json({ message: "Error deleting location", error: error.message });
    }
}

export { createLocation, getAllLocation, getSingleLocation, updateLocation, deleteLocation };


