import Visit from '../models/Visit.js';

export async function getAllVisits(filter = {}, { skip = 0, limit = 10 } = {}) {
  const [items, total] = await Promise.all([
    Visit.find(filter).skip(skip).limit(limit),
    Visit.countDocuments(filter)
  ]);
  return { items, total };
}

export async function getVisitById(id) {
  return await Visit.findById(id);
}

export async function createVisit(data) {
  return await Visit.create(data);
}

export async function updateVisit(id, data) {
  return await Visit.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteVisit(id) {
  return await Visit.findByIdAndDelete(id);
}

export async function getAverageDuration(monumentId) {
  const result = await Visit.aggregate([
    { $match: { monumentId } },
    { $group: { _id: null, avgDuration: { $avg: '$duration' } } }
  ]);
  return result[0]?.avgDuration || 0;
}
