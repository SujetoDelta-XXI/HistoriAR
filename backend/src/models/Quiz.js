import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false }
  }],
  explanation: { type: String }
}, { _id: false });

// Validación de opciones: 2-4 opciones con exactamente una correcta
QuestionSchema.path('options').validate(function(options) {
  if (options.length < 2 || options.length > 4) return false;
  const correctCount = options.filter(opt => opt.isCorrect).length;
  return correctCount === 1;
}, 'Cada pregunta debe tener entre 2 y 4 opciones con exactamente una correcta');

const QuizSchema = new mongoose.Schema({
  monumentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Monument', 
    required: true,
    index: true 
  },
  title: { type: String, required: true },
  description: { type: String },
  questions: {
    type: [QuestionSchema],
    validate: {
      validator: function(questions) {
        return questions.length >= 3 && questions.length <= 5;
      },
      message: 'El quiz debe tener entre 3 y 5 preguntas'
    }
  },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Quiz', QuizSchema);
