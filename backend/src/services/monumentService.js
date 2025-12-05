import Monument from '../models/Monument.js';
import ModelVersion from '../models/ModelVersion.js';
import HistoricalData from '../models/HistoricalData.js';
import gcsService from './gcsService.js';

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
  // Find monument first (to get GCS filenames and related info)
  const monument = await Monument.findById(id);
  if (!monument) return null;

  // Delete all model versions files and records
  try {
    const versions = await ModelVersion.find({ monumentId: id });
    for (const v of versions) {
      try {
        if (v.filename) await gcsService.deleteFile(v.filename);
      } catch (e) {
        console.warn('Failed deleting model version file from GCS:', e.message);
      }
    }
    await ModelVersion.deleteMany({ monumentId: id });
  } catch (e) {
    console.warn('Error cleaning model versions for monument', id, e.message);
  }

  // Delete monument image and model files referenced directly on the monument
  try {
    if (monument.gcsImageFileName) {
      try { await gcsService.deleteFile(monument.gcsImageFileName); } catch (e) { console.warn('Failed deleting monument image:', e.message); }
    }
    if (monument.gcsModelFileName) {
      try { await gcsService.deleteFile(monument.gcsModelFileName); } catch (e) { console.warn('Failed deleting monument model file:', e.message); }
    }
    // If there's a tiles URL inside our bucket, attempt to delete the file by extracting filename
    if (monument.model3DTilesUrl && gcsService.bucket && gcsService.bucket.name) {
      try {
        const prefix = `https://storage.googleapis.com/${gcsService.bucket.name}/`;
        if (monument.model3DTilesUrl.startsWith(prefix)) {
          const filename = monument.model3DTilesUrl.replace(prefix, '');
          await gcsService.deleteFile(filename);
        }
      } catch (e) { console.warn('Failed deleting monument tiles file:', e.message); }
    }
  } catch (e) {
    console.warn('Error cleaning monument direct files for', id, e.message);
  }

  // Delete historical data images and records
  try {
    const historyItems = await HistoricalData.find({ monumentId: id });
    for (const h of historyItems) {
      if (h.gcsImageFileName) {
        try { await gcsService.deleteFile(h.gcsImageFileName); } catch (e) { console.warn('Failed deleting historical image:', e.message); }
      }
      if (Array.isArray(h.oldImages)) {
        for (const imgUrl of h.oldImages) {
          if (!imgUrl) continue;
          try {
            // If oldImages stored full URLs, extract filename
            let filename = imgUrl;
            const prefix = `https://storage.googleapis.com/${gcsService.bucket.name}/`;
            if (filename.startsWith(prefix)) filename = filename.replace(prefix, '');
            await gcsService.deleteFile(filename);
          } catch (e) { console.warn('Failed deleting historical old image:', e.message); }
        }
      }
    }
    await HistoricalData.deleteMany({ monumentId: id });
  } catch (e) {
    console.warn('Error cleaning historical data for monument', id, e.message);
  }

  // Finally delete the monument document
  const deleted = await Monument.findByIdAndDelete(id);
  return deleted;
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
