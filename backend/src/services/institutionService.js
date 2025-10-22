import Institution from '../models/Institution.js';

export async function getAllInstitutions({ skip = 0, limit = 10 } = {}) {
  const [items, total] = await Promise.all([
    Institution.find().skip(skip).limit(limit),
    Institution.countDocuments()
  ]);
  return { items, total };
}

export async function getInstitutionById(id) {
  return await Institution.findById(id);
}

export async function createInstitution(data) {
  return await Institution.create(data);
}

export async function updateInstitution(id, data) {
  return await Institution.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteInstitution(id) {
  return await Institution.findByIdAndDelete(id);
}
