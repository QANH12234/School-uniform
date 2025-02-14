// Helper function to get the public URL for assets
export const getPublicAssetUrl = (path) => {
  return `${process.env.PUBLIC_URL}${path}`;
};

// Helper function to get product image URL
export const getProductImageUrl = (imageName) => {
  // If the image is a full URL, return it as is
  if (imageName.startsWith('http')) {
    return imageName;
  }
  
  // Otherwise, construct the path to the public assets
  return getPublicAssetUrl(`/assets/images/products/${imageName}`);
};

// Default image paths
export const defaultImages = {
  primary: '/assets/images/products/primary-uniform.jpg',
  secondary: '/assets/images/products/secondary-uniform.jpg',
  sixth: '/assets/images/products/sixth-uniform.jpg',
  hero: '/assets/images/hero.jpg',
  logo: '/assets/images/logo.png',
  placeholder: '/assets/images/placeholder.jpg'
};

// Function to get category image
export const getCategoryImage = (category) => {
  return getPublicAssetUrl(defaultImages[category] || defaultImages.placeholder);
};

// Function to handle image loading errors
export const handleImageError = (event) => {
  event.target.src = getPublicAssetUrl(defaultImages.placeholder);
}; 