import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';

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
  
  // Soporte para formato antiguo (compatibilidad)
  quiz.questions.forEach((q, i) => { 
    if (q.correctAnswer === userAnswers[i]) correct++; 
  });
  
  return {
    totalQuestions: quiz.questions.length,
    correct,
    score: Math.round((correct / quiz.questions.length) * 100)
  };
}

/**
 * Registrar intento de quiz
 * @param {string} userId - ID del usuario
 * @param {string} quizId - ID del quiz
 * @param {Array} answers - Array de respuestas [{questionIndex, selectedOptionIndex}]
 * @param {number} timeSpent - Tiempo en segundos
 * @returns {Promise<Object>} QuizAttempt creado
 */
export async function submitQuizAttempt(userId, quizId, answers, timeSpent) {
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new Error('Quiz not found');
    
    // Calcular respuestas correctas
    let correctAnswers = 0;
    const processedAnswers = answers.map((answer) => {
      const question = quiz.questions[answer.questionIndex];
      const isCorrect = question.options[answer.selectedOptionIndex].isCorrect;
      if (isCorrect) correctAnswers++;
      
      return {
        questionIndex: answer.questionIndex,
        selectedOptionIndex: answer.selectedOptionIndex,
        isCorrect
      };
    });
    
    // Crear registro de intento
    const attempt = new QuizAttempt({
      userId,
      quizId,
      monumentId: quiz.monumentId,
      answers: processedAnswers,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      percentageScore: Math.round((correctAnswers / quiz.questions.length) * 100),
      timeSpent
    });
    
    return await attempt.save();
  } catch (error) {
    console.error('Error submitting quiz attempt:', error);
    throw new Error(`Failed to submit quiz attempt: ${error.message}`);
  }
}

/**
 * Obtener intentos de usuario para un quiz
 * @param {string} userId - ID del usuario
 * @param {string} quizId - ID del quiz
 * @returns {Promise<Array>} Array de intentos
 */
export async function getUserAttempts(userId, quizId) {
  try {
    return await QuizAttempt.find({ userId, quizId })
      .sort({ completedAt: -1 });
  } catch (error) {
    console.error('Error getting user attempts:', error);
    throw new Error(`Failed to get user attempts: ${error.message}`);
  }
}

/**
 * Obtener todos los intentos de un quiz
 * @param {string} quizId - ID del quiz
 * @returns {Promise<Array>} Array de intentos con datos de usuario
 */
export async function getQuizAttempts(quizId) {
  try {
    return await QuizAttempt.find({ quizId })
      .populate('userId', 'name email')
      .sort({ completedAt: -1 });
  } catch (error) {
    console.error('Error getting quiz attempts:', error);
    throw new Error(`Failed to get quiz attempts: ${error.message}`);
  }
}

/**
 * Obtener todos los intentos de un usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Array de intentos con datos de quiz
 */
export async function getAllUserAttempts(userId) {
  try {
    return await QuizAttempt.find({ userId })
      .populate('quizId', 'title')
      .populate('monumentId', 'name')
      .sort({ completedAt: -1 });
  } catch (error) {
    console.error('Error getting all user attempts:', error);
    throw new Error(`Failed to get user attempts: ${error.message}`);
  }
}
