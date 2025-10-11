import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  monumentId: { type: mongoose.Schema.Types.ObjectId, ref: "Monument" },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Visit", visitSchema);
