import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, updateProduct } from '../../store/slices/productSlice';
import SuccessNotification from '../common/SuccessNotification';
import { 
  validateRequired, 
  validatePrice, 
  validateStock, 
  validateTextLength,
  validateImageFiles 
} from '../../utils/validators';

const SUSTAINABILITY_TAGS = ['organic', 'handmade', 'recycled'];

const ProductForm = ({ productToEdit, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    sustainabilityTags: [],
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        title: productToEdit.title || '',
        description: productToEdit.description || '',
        price: productToEdit.price || '',
        category: productToEdit.category || '',
        stock: productToEdit.stock || '',
        sustainabilityTags: productToEdit.sustainabilityTags || [],
      });
      setImagePreviews(productToEdit.images || []);
    }
  }, [productToEdit]);

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        return validateTextLength(value, 'Title', 3, 100);
      case 'description':
        return validateTextLength(value, 'Description', 10, 1000);
      case 'price':
        return validatePrice(value);
      case 'stock':
        return validateStock(value);
      case 'sustainabilityTags':
        return value.length === 0 ? 'Please select at least one sustainability tag' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Validate field on change if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setValidationErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    
    // Validate field on blur
    const error = validateField(name, value);
    setValidationErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleTagToggle = (tag) => {
    const newTags = formData.sustainabilityTags.includes(tag)
      ? formData.sustainabilityTags.filter((t) => t !== tag)
      : [...formData.sustainabilityTags, tag];
    
    setFormData((prev) => ({
      ...prev,
      sustainabilityTags: newTags,
    }));
    
    // Validate tags if touched
    if (touched.sustainabilityTags) {
      const error = validateField('sustainabilityTags', newTags);
      setValidationErrors((prev) => ({
        ...prev,
        sustainabilityTags: error,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate images
    const imageError = validateImageFiles(files);
    if (imageError) {
      setValidationErrors((prev) => ({
        ...prev,
        images: imageError,
      }));
      return;
    }
    
    setImages(files);
    setValidationErrors((prev) => ({
      ...prev,
      images: '',
    }));

    // Create image previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate all fields
    Object.keys(formData).forEach((key) => {
      if (key !== 'category') { // category is optional
        const error = validateField(key, formData[key]);
        if (error) {
          errors[key] = error;
        }
      }
    });
    
    // Validate images for new products
    if (!productToEdit && images.length === 0) {
      errors.images = 'Please upload at least one product image';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const productData = new FormData();
    productData.append('title', formData.title);
    productData.append('description', formData.description);
    productData.append('price', formData.price);
    productData.append('category', formData.category);
    productData.append('stock', formData.stock);
    
    formData.sustainabilityTags.forEach((tag) => {
      productData.append('sustainabilityTags', tag);
    });

    images.forEach((image) => {
      productData.append('images', image);
    });

    try {
      if (productToEdit) {
        await dispatch(updateProduct({ 
          productId: productToEdit._id, 
          productData 
        })).unwrap();
      } else {
        await dispatch(createProduct(productData)).unwrap();
      }
      
      // Show success message
      setSuccessMessage(productToEdit ? 'Product updated successfully!' : 'Product added successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        sustainabilityTags: [],
      });
      setImages([]);
      setImagePreviews([]);
      setValidationErrors({});
      setTouched({});
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setValidationErrors((prev) => ({
        ...prev,
        submit: err || 'Failed to save product',
      }));
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      sustainabilityTags: [],
    });
    setImages([]);
    setImagePreviews([]);
    setValidationErrors({});
    setTouched({});
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <>
      <SuccessNotification 
        message={successMessage} 
        onClose={() => setSuccessMessage('')}
      />
      
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          {productToEdit ? 'Edit Product' : 'Add New Product'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Product Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              validationErrors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter product title"
            aria-invalid={!!validationErrors.title}
            aria-describedby={validationErrors.title ? 'title-error' : undefined}
          />
          {validationErrors.title && (
            <p id="title-error" className="mt-1 text-sm text-red-600" role="alert">
              {validationErrors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            onBlur={handleBlur}
            rows="4"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              validationErrors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe your product"
            aria-invalid={!!validationErrors.description}
            aria-describedby={validationErrors.description ? 'description-error' : undefined}
          />
          {validationErrors.description && (
            <p id="description-error" className="mt-1 text-sm text-red-600" role="alert">
              {validationErrors.description}
            </p>
          )}
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              onBlur={handleBlur}
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                validationErrors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
              aria-invalid={!!validationErrors.price}
              aria-describedby={validationErrors.price ? 'price-error' : undefined}
            />
            {validationErrors.price && (
              <p id="price-error" className="mt-1 text-sm text-red-600" role="alert">
                {validationErrors.price}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              onBlur={handleBlur}
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                validationErrors.stock ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
              aria-invalid={!!validationErrors.stock}
              aria-describedby={validationErrors.stock ? 'stock-error' : undefined}
            />
            {validationErrors.stock && (
              <p id="stock-error" className="mt-1 text-sm text-red-600" role="alert">
                {validationErrors.stock}
              </p>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., Food, Clothing, Home Goods"
          />
        </div>

        {/* Sustainability Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sustainability Tags *
          </label>
          <div className="flex flex-wrap gap-2">
            {SUSTAINABILITY_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  handleTagToggle(tag);
                  setTouched((prev) => ({ ...prev, sustainabilityTags: true }));
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  formData.sustainabilityTags.includes(tag)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </button>
            ))}
          </div>
          {validationErrors.sustainabilityTags && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {validationErrors.sustainabilityTags}
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
            Product Images {!productToEdit && '*'}
          </label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              validationErrors.images ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={!!validationErrors.images}
            aria-describedby={validationErrors.images ? 'images-error' : 'images-help'}
          />
          <p id="images-help" className="text-xs text-gray-500 mt-1">
            You can upload up to 5 images (max 5MB each). First image will be the main product image.
          </p>
          {validationErrors.images && (
            <p id="images-error" className="mt-1 text-sm text-red-600" role="alert">
              {validationErrors.images}
            </p>
          )}
        </div>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Preview
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 sm:h-32 object-cover rounded-md border border-gray-300 group-hover:opacity-90 transition"
                    loading="lazy"
                  />
                  {index === 0 && (
                    <span className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {(validationErrors.submit || error) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" role="alert">
            {validationErrors.submit || error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : (
              productToEdit ? 'Update Product' : 'Add Product'
            )}
          </button>
          
          {productToEdit && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      </div>
    </>
  );
};

export default ProductForm;
