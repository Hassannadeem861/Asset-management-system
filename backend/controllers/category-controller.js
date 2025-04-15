import categoryModel from "../modles/category-model.js";



const createCategory = async (req, res) => {
    try {

        const  {name, desciption }  = req.body;

        if (!name) {
            return res.status(400).json({ message: "Please provide category name" });
            
        }

        const category = await categoryModel.create(req.body);

        return res.status(201).json({ message: "Category created successfully", category });

    } catch (error) {
        return res.status(500).json({ message: "Error creating category", error: error.message });
    }
}

const getAllCategory = async (req, res) => {
   
    try {

        const page = req.query.page || 1;
      
        const limit = req.query.limit || 10;
      
        const skip = (page - 1) * limit;

        const categorys = await categoryModel.find().skip(skip).limit(limit);

        const totalLocations = await categoryModel.countDocuments();


        return res.status(201).json({ message: "Fetch all department successfully", categorys, totalLocations, currentPage: page, totalPages: Math.ceil(totalLocations / limit) });

    } catch (error) {
        return res.status(500).json({ message: "Error creating department", error: error.message });
    }
}


export { createCategory, getAllCategory };