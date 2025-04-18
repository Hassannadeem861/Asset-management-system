import mongoose from "mongoose";

const userSchema = new mongoose.Schema(

  {

    username: { type: String, required: true, trim: true },

    email: { type: String, required: true, unique: true, toLowerCase: true },

    password: { type: String, required: true, select: false },

    cnic: { type: Number, required: true, unique: true },

    phone: { type: Number, required: true, unique: true },

    address: { type: String, required: true },

    role: {
      type: String,
      default: "user",
      toLowerCase: true
    },

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },

    // history: [
    //   {
    //     checkin: {
    //       type: Date,
    //       default: Date.now
    //     },
    //     checkout: {
    //       type: Date,
    //       default: Date.now
    //     }
    //   }
    // ]

    // role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },

  },

  { timestamps: true }

);

const User = mongoose.model("Auth", userSchema);
export default User;