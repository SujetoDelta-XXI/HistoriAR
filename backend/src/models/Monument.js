import mongoose from 'mongoose';

const MonumentSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  category:    { type: String, enum: ['Arqueológico', 'Colonial', 'Republicano', 'Contemporáneo'], default: 'Arqueológico' },
  location: {
    lat:      { type: Number },
    lng:      { type: Number },
    address:  { type: String },
    district: { type: String }
  },
  period: {
    name:      { type: String },
    startYear: { type: Number },
    endYear:   { type: Number }
  },
  culture:      { type: String },
  imageUrl:     { type: String }, // URL Cloudinary
  model3DUrl:   { type: String }, // URL Cloudinary
  institutionId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Institution' },
  status:       { type: String, enum: ['Disponible', 'Oculto', 'Borrado'], default: 'Disponible' },
  createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Monument', MonumentSchema);
