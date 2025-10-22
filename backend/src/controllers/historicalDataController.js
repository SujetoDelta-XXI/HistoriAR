import { buildPagination } from '../utils/pagination.js';
import { getAllHistoricalData, getHistoricalDataById, createHistoricalData, updateHistoricalData, deleteHistoricalData } from '../services/historicalDataService.js';

export async function listHistoricalData(req, res) {
  try {
    const { skip, limit, page } = buildPagination(req.query);
    const { items, total } = await getAllHistoricalData({ skip, limit });
    res.json({ page, total, items });
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function getHistoricalData(req, res) {
  const doc = await getHistoricalDataById(req.params.id);
  if (!doc) return res.status(404).json({ message: 'No encontrado' });
  res.json(doc);
}

export async function createHistoricalDataController(req, res) {
  try {
    const body = { ...req.body };
    if (req.files?.oldImages) body.oldImages = req.files.oldImages.map(f => f.path);
    const doc = await createHistoricalData(body);
    res.status(201).json({ id: doc._id });
  } catch (err) { res.status(400).json({ message: err.message }); }
}

export async function updateHistoricalDataController(req, res) {
  try {
    const data = { ...req.body };
    if (req.files?.oldImages) data.oldImages = req.files.oldImages.map(f => f.path);
    const doc = await updateHistoricalData(req.params.id, data);
    if (!doc) return res.status(404).json({ message: 'No encontrado' });
    res.json(doc);
  } catch (err) { res.status(400).json({ message: err.message }); }
}

export async function deleteHistoricalDataController(req, res) {
  const doc = await deleteHistoricalData(req.params.id);
  if (!doc) return res.status(404).json({ message: 'No encontrado' });
  res.json({ message: 'Eliminado' });
}
