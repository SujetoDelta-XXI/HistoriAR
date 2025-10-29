import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  description: { 
    type: String 
  },
  color: { 
    type: String, 
    default: '#3B82F6' // Color hex para la UI
  },
  icon: { 
    type: String, 
    default: 'Building' // Nombre del icono de Lucide React
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

// Índice para búsquedas
CategorySchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Category', CategorySchema);