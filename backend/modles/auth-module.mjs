import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    
    username: { type: String, required: true, trim: true },
   
    email: { type: String, required: true, unique: true },

    cnic: { type: Number, required: true, unique: true },
   
    password: { type: String, required: true, select: false },
   
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
   
    department: { type: mongoose.Types.ObjectId, ref: 'Department' },
   
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },

    lastActive: {
      type: Date,
      default: Date.now,
    }

  },

  { timestamps: true }

);

const User = mongoose.model("Auth", userSchema);
export default User;