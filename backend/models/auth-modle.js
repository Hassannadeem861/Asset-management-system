import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
 
  {
    
    username: { type: String, required: true, trim: true },
   
    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    cnic: { type: Number, required: true, unique: true },
   
    phone: { type: Number, required: true, unique: true },

    address: { type: String, required: true },
   
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },

      
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    

  },

  { timestamps: true }

);

const User = mongoose.model("Auth", userSchema);
export default User;