import { Cloudinary } from "@cloudinary/url-gen";
import { scale, fill } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";

// Initialize Cloudinary instance
// Make sure to set VITE_CLOUDINARY_CLOUD_NAME in your .env file
export const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo' // Fallback to demo if not set
  }
});

/**
 * Generates an optimized Cloudinary URL
 * @param {string} publicId - The public ID of the image in Cloudinary
 * @param {object} options - Options for resizing
 * @param {number} options.width - Request specific width
 * @param {number} options.height - Request specific height
 * @returns {string} - The full image URL
 */
export const getImageUrl = (publicId, { width, height } = {}) => {
  if (!publicId) return '';
  
  // If it's already a full URL (like unsplash placeholder), return it properly
  if (publicId.startsWith('http')) return publicId;

  const myImage = cld.image(publicId);

  // Apply optimizations
  myImage.delivery(quality('auto'));
  myImage.delivery(format('auto'));

  // Apply resizing if dimensions provided
  if (width && height) {
    myImage.resize(fill().width(width).height(height).gravity(autoGravity()));
  } else if (width) {
     myImage.resize(scale().width(width));
  }

  return myImage.toURL();
};
