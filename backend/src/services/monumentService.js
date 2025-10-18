import Monument from '../models/Monument.js';

export async function getAllMonuments(filter = {}, { skip = 0, limit = 10, populate = false } = {}) {
  const query = Monument.find(filter).skip(skip).limit(limit);
  if (populate) query.populate('institutionId createdBy');
  const [items, total] = await Promise.all([ query, Monument.countDocuments(filter) ]);
  return { items, total };
}

export async function getMonumentById(id, populate = false) {
  const query = Monument.findById(id);
  if (populate) query.populate('institutionId createdBy');
  return await query;
}

export async function createMonument(data) {
  return await Monument.create(data);
}

export async function updateMonument(id, data) {
  return await Monument.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteMonument(id) {
  return await Monument.findByIdAndUpdate(id, { status: 'Borrado' }, { new: true });
}
