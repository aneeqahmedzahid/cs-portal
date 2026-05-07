// Cloudinary configuration and helper functions
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME';
const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY || '499438575588685';

export const getCloudinaryUrl = (publicId, type = 'image') => {
  if (!publicId) return '';
  if (publicId.startsWith('http')) return publicId;
  return `https://res.cloudinary.com/${cloudName}/${type}/upload/${publicId}`;
};

// Upload image to Cloudinary via backend (more secure)
export async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'cs_portal_uploads'); // You'll need to create this in Cloudinary

  // If we want to do it via backend (recommended since we have API secret there)
  // For now, let's assume the backend has an upload endpoint
  const token = sessionStorage.getItem('admin_token');
  const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to upload image');
  }

  const data = await res.json();
  return data.url;
}
