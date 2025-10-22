import { buildPagination } from '../utils/pagination.js';
import { getAllQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz, evaluateQuiz } from '../services/quizService.js';

export async function listQuiz(req, res) {
  try {
    const { skip, limit, page } = buildPagination(req.query);
    const filter = {};
    if (req.query.monumentId) filter.monumentId = req.query.monumentId;
    const { items, total } = await getAllQuizzes(filter, { skip, limit });
    res.json({ page, total, items });
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function getQuiz(req, res) {
  const doc = await getQuizById(req.params.id);
  if (!doc) return res.status(404).json({ message: 'No encontrado' });
  res.json(doc);
}

export async function createQuizController(req, res) {
  try {
    const doc = await createQuiz(req.body);
    res.status(201).json({ id: doc._id });
  } catch (err) { res.status(400).json({ message: err.message }); }
}

export async function updateQuizController(req, res) {
  try {
    const doc = await updateQuiz(req.params.id, req.body);
    if (!doc) return res.status(404).json({ message: 'No encontrado' });
    res.json(doc);
  } catch (err) { res.status(400).json({ message: err.message }); }
}

export async function deleteQuizController(req, res) {
  const doc = await deleteQuiz(req.params.id);
  if (!doc) return res.status(404).json({ message: 'No encontrado' });
  res.json({ message: 'Eliminado' });
}

export async function evaluateQuizController(req, res) {
  try {
    const { answers } = req.body; // array de índices
    const result = await evaluateQuiz(req.params.id, answers || []);
    res.json(result);
  } catch (err) { res.status(400).json({ message: err.message }); }
}
