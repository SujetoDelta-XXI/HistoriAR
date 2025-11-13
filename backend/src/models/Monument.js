import mongoose from 'mongoose';

const MonumentSchema = new mongoose.Schema({
  name:        { type: String, required: true, index: true },
  description: { type: String, index: 'text' },
  categoryId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  location: {
    lat:      { type: Number },
    lng:      { type: Number },
    address:  { type: String },
    district: { type: String, index: true }
  },
  period: {
    name:      { type: String },
    startYear: { type: Number },
    endYear:   { type: Number }
  },
  culture:      { type: String },
  imageUrl:     { type: String }, // GCS URL for monument images
  model3DUrl:   { type: String }, // GCS URL for 3D models
  model3DTilesUrl: { type: String }, // GCS URL for 3D Tiles tileset.json (opcional)
  gcsImageFileName: { type: String }, // GCS filename for image deletion
  gcsModelFileName: { type: String }, // GCS filename for model deletion (renamed from gcsFileName)
  institutionId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Institution', index: true },
  status:       { type: String, enum: ['Disponible', 'Oculto', 'Borrado'], default: 'Disponible' },
  createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Add text index for search functionality (Requirements 4.1, 4.2, 5.1, 5.2)
MonumentSchema.index({ name: 'text', description: 'text' });

// Add compound indexes for query optimization (Requirements 4.5, 5.4)
MonumentSchema.index({ status: 1, categoryId: 1 });
MonumentSchema.index({ status: 1, 'location.district': 1 });
MonumentSchema.index({ status: 1, institutionId: 1 });
MonumentSchema.index({ status: 1, name: 1 }); // For default sorting

export default mongoose.model('Monument', MonumentSchema);
