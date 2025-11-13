import { buildPagination } from '../utils/pagination.js';
import { getAllInstitutions, getInstitutionById, createInstitution, updateInstitution, deleteInstitution } from '../services/institutionService.js';

export async function listInstitution(req, res) {
  try {
    const { skip, limit, page } = buildPagination(req.query);
    const availableOnly = req.query.availableOnly === 'true';
    const { items, total } = await getAllInstitutions({ skip, limit, availableOnly });
    res.json({ page, total, items });
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function getInstitution(req, res) {
  const doc = await getInstitutionById(req.params.id);
  if (!doc) return res.status(404).json({ message: 'No encontrado' });
  res.json(doc);
}

export async function createInstitutionController(req, res) {
  try {
    const doc = await createInstitution(req.body);
    res.status(201).json({ id: doc._id });
  } catch (err) { res.status(400).json({ message: err.message }); }
}

export async function updateInstitutionController(req, res) {
  try {
    const doc = await updateInstitution(req.params.id, req.body);
    if (!doc) return res.status(404).json({ message: 'No encontrado' });
    res.json(doc);
  } catch (err) { res.status(400).json({ message: err.message }); }
}

export async function deleteInstitutionController(req, res) {
  const doc = await deleteInstitution(req.params.id);
  if (!doc) return res.status(404).json({ message: 'No encontrado' });
  res.json({ message: 'Eliminado' });
}
