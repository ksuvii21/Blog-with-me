// utils/cloudinary.js - TEMPORARY FIX FOR TESTING
export const uploadImage = async (file) => {
  const cloudName = 'dl5xtuwim'; // Your actual cloud name
  const uploadPreset = 'blog-upload'; // Your actual upload preset
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};