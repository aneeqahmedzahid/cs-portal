import { api } from './api';

// Cloudinary configuration and helper functions
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dnk53wxac';

export const getCloudinaryUrl = (publicId, type = 'image') => {
  if (!publicId) return '';
  if (publicId.startsWith('http')) return publicId;
  return `https://res.cloudinary.com/${cloudName}/${type}/upload/${publicId}`;
};

/**
 * Upload image to Cloudinary via backend
 */
export async function uploadToCloudinary(file) {
  try {
    const data = await api.uploadImage(file);
    return data.url;
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    throw err;
  }
}

