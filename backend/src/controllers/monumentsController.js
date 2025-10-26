import { buildPagination } from '../utils/pagination.js';
import { getAllMonuments, getMonumentById, createMonument, updateMonument, deleteMonument, searchMonuments, getFilterOptions } from '../services/monumentService.js';
import gcsService from '../services/gcsService.js';

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
    
    // Handle image upload to GCS
    if (req.files?.image?.[0]) {
      const imageFile = req.files.image[0];
      try {
        gcsService.validateImageFile(imageFile);
        const imageResult = await gcsService.uploadImage(
          imageFile.buffer,
          imageFile.originalname,
          imageFile.mimetype
        );
        payload.imageUrl = imageResult.url;
        payload.gcsImageFileName = imageResult.filename;
      } catch (uploadError) {
        return res.status(400).json({ message: `Image upload failed: ${uploadError.message}` });
      }
    }
    
    // Handle 3D model upload to GCS
    if (req.files?.model3d?.[0]) {
      const modelFile = req.files.model3d[0];
      try {
        gcsService.validateModelFile(modelFile);
        const modelResult = await gcsService.uploadModel(
          modelFile.buffer,
          modelFile.originalname,
          modelFile.mimetype
        );
        payload.model3DUrl = modelResult.url;
        payload.gcsModelFileName = modelResult.filename;
      } catch (uploadError) {
        return res.status(400).json({ message: `3D model upload failed: ${uploadError.message}` });
      }
    }
    
    const doc = await createMonument(payload);
    res.status(201).json({ id: doc._id });
  } catch (err) { 
    res.status(400).json({ message: err.message }); 
  }
}

export async function updateMonumentController(req, res) {
  try {
    const data = { ...req.body };
    
    // Handle image upload to GCS
    if (req.files?.image?.[0]) {
      const imageFile = req.files.image[0];
      try {
        gcsService.validateImageFile(imageFile);
        const imageResult = await gcsService.uploadImage(
          imageFile.buffer,
          imageFile.originalname,
          imageFile.mimetype
        );
        data.imageUrl = imageResult.url;
        data.gcsImageFileName = imageResult.filename;
      } catch (uploadError) {
        return res.status(400).json({ message: `Image upload failed: ${uploadError.message}` });
      }
    }
    
    // Handle 3D model upload to GCS
    if (req.files?.model3d?.[0]) {
      const modelFile = req.files.model3d[0];
      try {
        gcsService.validateModelFile(modelFile);
        const modelResult = await gcsService.uploadModel(
          modelFile.buffer,
          modelFile.originalname,
          modelFile.mimetype
        );
        data.model3DUrl = modelResult.url;
        data.gcsModelFileName = modelResult.filename;
      } catch (uploadError) {
        return res.status(400).json({ message: `3D model upload failed: ${uploadError.message}` });
      }
    }
    
    const doc = await updateMonument(req.params.id, data);
    if (!doc) return res.status(404).json({ message: 'No encontrado' });
    res.json(doc);
  } catch (err) { 
    res.status(400).json({ message: err.message }); 
  }
}

export async function deleteMonumentController(req, res) {
  const doc = await deleteMonument(req.params.id);
  if (!doc) return res.status(404).json({ message: 'No encontrado' });
  res.json({ message: 'Marcado como Borrado' });
}

export async function searchMonumentsController(req, res) {
  try {
    const { skip, limit, page } = buildPagination(req.query);
    const searchParams = {
      text: req.query.text,
      district: req.query.district,
      category: req.query.category,
      institution: req.query.institution
    };
    
    const { items, total } = await searchMonuments(searchParams, { 
      skip, 
      limit, 
      populate: req.query.populate === 'true' 
    });
    
    res.json({ page, total, items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getFilterOptionsController(req, res) {
  try {
    const options = await getFilterOptions();
    res.json(options);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
