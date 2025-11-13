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

export async function searchMonuments(searchParams, { skip = 0, limit = 10, populate = false } = {}) {
  const { text, district, category, institution } = searchParams;
  
  // Build search query
  const query = {};
  
  // Text search with relevance scoring (Requirements 4.1, 5.1, 5.2, 5.3)
  if (text && text.trim()) {
    query.$text = { $search: text.trim() };
  }
  
  // Filter by district (Requirements 4.2)
  if (district && district.trim()) {
    query['location.district'] = { $regex: district.trim(), $options: 'i' };
  }
  
  // Filter by category (Requirements 4.3)
  if (category && category.trim()) {
    query.category = category.trim();
  }
  
  // Filter by institution (Requirements 4.4)
  if (institution && institution.trim()) {
    query.institutionId = institution.trim();
  }
  
  // Only show available monuments
  query.status = 'Disponible';
  
  // Build MongoDB query
  let mongoQuery = Monument.find(query);
  
  // Add text score for relevance sorting when text search is used
  if (text && text.trim()) {
    mongoQuery = mongoQuery.select({ score: { $meta: 'textScore' } });
    mongoQuery = mongoQuery.sort({ score: { $meta: 'textScore' } });
  } else {
    // Default sorting by name when no text search
    mongoQuery = mongoQuery.sort({ name: 1 });
  }
  
  // Apply pagination
  mongoQuery = mongoQuery.skip(skip).limit(limit);
  
  // Add population if requested
  if (populate) {
    mongoQuery = mongoQuery.populate('institutionId createdBy');
  }
  
  // Execute query and count
  const [items, total] = await Promise.all([
    mongoQuery.exec(),
    Monument.countDocuments(query)
  ]);
  
  return { items, total };
}

export async function getFilterOptions() {
  // Get unique districts, categories, and institutions for filter dropdowns (Requirements 4.5, 5.4)
  const [districts, categories, institutions] = await Promise.all([
    Monument.distinct('location.district', { status: 'Disponible', 'location.district': { $ne: null, $ne: '' } }),
    Monument.distinct('category', { status: 'Disponible' }),
    Monument.aggregate([
      { $match: { status: 'Disponible', institutionId: { $ne: null } } },
      { $group: { _id: '$institutionId' } },
      { $lookup: { from: 'institutions', localField: '_id', foreignField: '_id', as: 'institution' } },
      { $unwind: '$institution' },
      { $project: { _id: '$institution._id', name: '$institution.name' } },
      { $sort: { name: 1 } }
    ])
  ]);
  
  return {
    districts: districts.filter(d => d).sort(),
    categories: categories.sort(),
    institutions: institutions
  };
}
