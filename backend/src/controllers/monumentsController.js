import { buildPagination } from '../utils/pagination.js';
import { getAllMonuments, getMonumentById, createMonument, updateMonument, deleteMonument, searchMonuments, getFilterOptions } from '../services/monumentService.js';
import gcsService from '../services/gcsService.js';

export async function listMonument(req, res) {
  try {
    const { skip, limit, page } = buildPagination(req.query);
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status)   filter.status   = req.query.status;
    
    // Support availableOnly filter
    if (req.query.availableOnly === 'true') {
      filter.status = 'Disponible';
    }
    
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
    
    // Get current monument to check status change
    const currentMonument = await getMonumentById(req.params.id);
    if (!currentMonument) {
      return res.status(404).json({ message: 'Monumento no encontrado' });
    }
    
    // Validate status change to "Disponible"
    if (data.status === 'Disponible' && currentMonument.status !== 'Disponible') {
      if (!currentMonument.imageUrl && !data.imageUrl) {
        return res.status(400).json({ 
          message: 'No se puede hacer disponible un monumento sin imagen. Por favor, agrega una imagen primero.' 
        });
      }
    }
    
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
  res.json({ message: 'Monumento eliminado', id: doc._id });
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

/**
 * Obtener historial de versiones de modelo 3D
 */
export async function getModelVersionsController(req, res) {
  try {
    const versions = await gcsService.getFileHistory(req.params.id);
    res.json({ total: versions.length, items: versions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/**
 * Activate a specific model version
 */
export async function activateModelVersionController(req, res) {
  try {
    const version = await gcsService.activateVersion(req.params.id, req.params.versionId);
    res.json({ message: 'Version activated successfully', version });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

/**
 * Eliminar versión de modelo 3D
 */
export async function deleteModelVersionController(req, res) {
  try {
    await gcsService.deleteVersion(req.params.id, req.params.versionId);
    res.json({ message: 'Version deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

/**
 * Upload a new 3D model version for a monument
 */
export async function uploadModelVersionController(req, res) {
  try {
    // Validate that a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No model file provided' });
    }

    const monumentId = req.params.id;
    const userId = req.user?.sub || req.user?.id || req.user?._id;

    if (!userId) {
      console.error('User ID not found in request:', req.user);
      return res.status(401).json({ message: 'User authentication failed' });
    }

    // Validate the model file
    try {
      gcsService.validateModelFile(req.file);
    } catch (validationError) {
      return res.status(400).json({ message: validationError.message });
    }

    // Upload model with versioning
    const result = await gcsService.uploadModelWithVersioning(
      req.file.buffer,
      monumentId,
      req.file.originalname,
      req.file.mimetype,
      userId
    );

    res.status(201).json({
      versionId: result.versionId,
      url: result.url,
      filename: result.filename,
      message: 'Model version uploaded successfully'
    });
  } catch (err) {
    console.error('Error uploading model version:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ message: err.message || 'Internal server error' });
  }
}
