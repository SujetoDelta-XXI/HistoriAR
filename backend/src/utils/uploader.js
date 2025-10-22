import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// imágenes (jpg/png/webp)
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'historiar/images',
    resource_type: 'image'
  })
});

// modelos 3D / pesados (glb/gltf/usdz/pdf/video/etc)
const modelStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'historiar/models',
    resource_type: 'auto'
  })
});

export const uploadImage = multer({ storage: imageStorage });
export const uploadModel = multer({ storage: modelStorage });
