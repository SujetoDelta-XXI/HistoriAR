import { buildPagination } from '../utils/pagination.js';
import { getAllMonuments, getMonumentById, createMonument, updateMonument, deleteMonument } from '../services/monumentService.js';

export async function listMonument(req, res) {
  try {
    const { skip, limit, page } = buildPagination(req.query);
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status)   filter.status   = req.query.status;
    const { items, total } = await getAllMonuments(filter, { skip, limit, populate: req.query.populate === 'true' });
    res.json({ page, total, items });
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function getMonument(req, res) {
  const doc = await getMonumentById(req.params.id, req.query.populate === 'true');
  if (!doc) return res.status(404).json({ message: 'No encontrado' });
  res.json(doc);
}

export async function createMonumentController(req, res) {
  try {
    const payload = { ...req.body, createdBy: req.user?.sub };
    if (req.files?.image?.[0]?.path)   payload.imageUrl  = req.files.image[0].path;
    if (req.files?.model3d?.[0]?.path) payload.model3DUrl = req.files.model3d[0].path;
    const doc = await createMonument(payload);
    res.status(201).json({ id: doc._id });
  } catch (err) { res.status(400).json({ message: err.message }); }
}

export async function updateMonumentController(req, res) {
  try {
    const data = { ...req.body };
    if (req.files?.image?.[0]?.path)   data.imageUrl  = req.files.image[0].path;
    if (req.files?.model3d?.[0]?.path) data.model3DUrl = req.files.model3d[0].path;
    const doc = await updateMonument(req.params.id, data);
    if (!doc) return res.status(404).json({ message: 'No encontrado' });
    res.json(doc);
  } catch (err) { res.status(400).json({ message: err.message }); }
}

export async function deleteMonumentController(req, res) {
  const doc = await deleteMonument(req.params.id);
  if (!doc) return res.status(404).json({ message: 'No encontrado' });
  res.json({ message: 'Marcado como Borrado' });
}
