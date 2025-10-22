import Quiz from '../models/Quiz.js';

export async function getAllQuizzes(filter = {}, { skip = 0, limit = 10 } = {}) {
  const [items, total] = await Promise.all([
    Quiz.find(filter).skip(skip).limit(limit),
    Quiz.countDocuments(filter)
  ]);
  return { items, total };
}

export async function getQuizById(id) {
  return await Quiz.findById(id);
}

export async function createQuiz(data) {
  return await Quiz.create(data);
}

export async function updateQuiz(id, data) {
  return await Quiz.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteQuiz(id) {
  return await Quiz.findByIdAndDelete(id);
}

export async function evaluateQuiz(quizId, userAnswers = []) {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error('Quiz no encontrado');
  let correct = 0;
  quiz.questions.forEach((q, i) => { if (q.correctAnswer === userAnswers[i]) correct++; });
  return {
    totalQuestions: quiz.questions.length,
    correct,
    score: Math.round((correct / quiz.questions.length) * 100)
  };
}
