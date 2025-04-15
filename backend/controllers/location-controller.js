import locationModel from "../modles/location-model.js";


const createLocation = async (req, res) => {
    try {

        const  {name, address, city }  = req.body;

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

export { createLocation, getAllLocation };


