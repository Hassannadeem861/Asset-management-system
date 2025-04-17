import mongoose from "mongoose";



const adminSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, toLowerCase: true },
        email: { type: String, required: true, unique: true, trim: true, toLowerCase: true },
        password: { type: String, required: true, select: false },
        // role: {
        //     type: String,
        //     toLowerCase: true,
        //     default: "admin",
        // }

    },
    { timestamps: true }
);
const Admin = mongoose.model("AdminAuth", adminSchema);
export default Admin;