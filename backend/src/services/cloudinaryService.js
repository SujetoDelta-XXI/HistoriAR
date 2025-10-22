import cloudinary from '../config/cloudinary.js';

export async function uploadFile(filePath, { folder = 'historiar/assets', resourceType = 'auto' } = {}) {
  const result = await cloudinary.uploader.upload(filePath, { folder, resource_type: resourceType });
  return { url: result.secure_url, public_id: result.public_id };
}

export async function deleteFile(publicId, resourceType = 'auto') {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  return { message: 'Archivo eliminado' };
}

export async function listFiles(prefix = 'historiar/', max = 30) {
  const res = await cloudinary.api.resources({ type: 'upload', prefix, max_results: max });
  return res.resources.map(r => ({ url: r.secure_url, id: r.public_id, bytes: r.bytes }));
}
