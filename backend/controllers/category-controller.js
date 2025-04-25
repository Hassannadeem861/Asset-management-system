import categoryModel from "../models/category-model.js";



const createCategory = async (req, res) => {
    try {

        const { name, desciption } = req.body;

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

const getSingleCategory = async (req, res) => {

    try {

        const { id } = req.params;

        const category = await categoryModel.findById(id)

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json({ message: "Fetch single category successfully", category });

    } catch (error) {

        return res.status(500).json({ message: "Error fetching category", error: error.message });
    }
}

const updateAsset = async (req, res) => {
    try {

        const { id } = req.params;

        const { name, description } = req.body;

        if (!name && !description) {
            return res.status(400).json({ message: "At least one field is edit" });
        }

        const category = await categoryModel.findById(id);

        if (!category) return res.status(404).json({ message: "Category not found" });

        const updatedCategory = await categoryModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        return res.status(200).json({ message: "Category updated successfully", updatedCategory });

    } catch (error) {
        return res.status(500).json({ message: "Category update failed", error: error.message });
    }
};


const deleteAsset = async (req, res) => {
    try {

        const { id } = req.params;

        const category = await categoryModel.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json({ message: "Category deleted successfully" });

    }

    catch (error) {

        return res.status(500).json({ message: "Error deleting category", error: error.message });
    }
}

export { createCategory, getAllCategory, getSingleCategory, updateAsset, deleteAsset };