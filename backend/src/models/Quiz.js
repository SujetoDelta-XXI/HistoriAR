import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  question:      { type: String, required: true },
  options:       [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }
}, { _id: false });

const QuizSchema = new mongoose.Schema({
  monumentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Monument', required: true },
  title:      { type: String, required: true },
  description:{ type: String },
  questions:  { type: [QuestionSchema], default: [] }
}, { timestamps: { createdAt: true, updatedAt: true } });

export default mongoose.model('Quiz', QuizSchema);
