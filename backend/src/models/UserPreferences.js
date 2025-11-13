import mongoose from 'mongoose';

const UserPreferencesSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true,
    index: true 
  },
  askForQuizzes: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

export default mongoose.model('UserPreferences', UserPreferencesSchema);
