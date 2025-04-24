import mongoose from "mongoose";

const userSchema = new mongoose.Schema(

  {

    username: { type: String, required: true, trim: true },

    email: { type: String, required: true, unique: true, toLowerCase: true },

    password: { type: String, required: true, select: false },

    cnic: { type: String, required: true, unique: true, match: /^[0-9]{13}$/ },

    phone: { type: String, required: true, unique: true, match: /^[0-9]{11}$/ },

    address: { type: String, required: true },

    role: {
      type: String,
      default: "user",
      toLowerCase: true
    },

    status: {
      type: String,
      enum: ['checkin', 'checkout'],
      // default: 'active'
    },

    // history: [
    //   {
    //     checkin: {
    //       type: Date,
    //       default: ''
    //     },
    //     checkout: {
    //       type: Date,
    //       default: ''
    //     },

    //     asset: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "Asset"
    //     }
    //   }
    // ]

  },

  { timestamps: true }

);

const User = mongoose.model("Auth", userSchema);
export default User;