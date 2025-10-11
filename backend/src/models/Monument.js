import mongoose from "mongoose";

const monumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  location: {
    lat: Number,
    lng: Number,
    address: String,
  },
  imageUrl: String,
  model3DUrl: String,
}, { timestamps: true });

export default mongoose.model("Monument", monumentSchema);
