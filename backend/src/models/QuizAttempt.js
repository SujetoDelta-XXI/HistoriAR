import mongoose from 'mongoose';

const QuizAttemptSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  quizId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Quiz', 
    required: true,
    index: true 
  },
  monumentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Monument', 
    required: true,
    index: true 
  },
  answers: [{
    questionIndex: { type: Number, required: true },
    selectedOptionIndex: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true }
  }],
  correctAnswers: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentageScore: { type: Number, required: true },
  timeSpent: { type: Number }, // En segundos
  completedAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  }
}, { timestamps: true });

// Índice compuesto para queries de historial de usuario
QuizAttemptSchema.index({ userId: 1, quizId: 1, completedAt: -1 });

export default mongoose.model('QuizAttempt', QuizAttemptSchema);
