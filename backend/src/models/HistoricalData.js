import mongoose from 'mongoose';

const HistoricalDataSchema = new mongoose.Schema({
  monumentId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Monument', required: true },
  title:        { type: String, required: true },
  description:  { type: String },
  discoveryInfo:{ type: String },
  oldImages:    [{ type: String }], // URLs Cloudinary
  activities:   [{ type: String }],
  sources:      [{ type: String }]
}, { timestamps: { createdAt: true, updatedAt: true } });

export default mongoose.model('HistoricalData', HistoricalDataSchema);
