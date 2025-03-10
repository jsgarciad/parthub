import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PartRequest, Part } from '../../types/models';

interface PartFormProps {
  part?: Part;
  onSubmit: (data: PartRequest) => Promise<void>;
  isSubmitting: boolean;
}

/**
 * Part form component for creating and editing parts
 */
const PartForm: React.FC<PartFormProps> = ({ part, onSubmit, isSubmitting }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Helper function to ensure price is a valid number
  const ensureValidPrice = (price: any): number => {
    if (price === undefined || price === null) {
      return 0;
    }
    
    // Convert to number if it's a string
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Check if it's a valid number after conversion
    if (isNaN(numPrice)) {
      return 0;
    }
    
    return numPrice;
  };
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PartRequest>({
    defaultValues: part ? {
      name: part.name || '',
      description: part.description || '',
      price: ensureValidPrice(part.price),
      imageUrl: part.imageUrl || '',
      isAvailable: part.isAvailable !== false, // Default to true if undefined
      category: part.category || '',
      brand: part.brand || '',
      model: part.model || '',
      year: part.year || '',
    } : {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      isAvailable: true,
      category: '',
      brand: '',
      model: '',
      year: '',
    },
  });

  // Watch the imageUrl field to update the preview
  const imageUrl = watch('imageUrl');

  // Update form when part changes
  useEffect(() => {
    if (part) {
      reset({
        name: part.name || '',
        description: part.description || '',
        price: ensureValidPrice(part.price),
        imageUrl: part.imageUrl || '',
        isAvailable: part.isAvailable !== false, // Default to true if undefined
        category: part.category || '',
        brand: part.brand || '',
        model: part.model || '',
        year: part.year || '',
      });
    }
  }, [part, reset]);

  // Update image preview when imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
  }, [imageUrl]);

  // Custom submit handler to validate data before sending
  const handleFormSubmit = async (data: PartRequest) => {
    setFormError(null);
    
    try {
      // Ensure price is a valid number
      data.price = ensureValidPrice(data.price);
      
      // Ensure required fields have values
      if (!data.name) {
        data.name = 'Unnamed Part';
      }
      
      // Call the onSubmit function provided by the parent component
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
      setFormError(error instanceof Error ? error.message : 'An error occurred while saving the part');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {formError && (
        <div className="p-3 bg-red-100 text-red-700 rounded mb-4">
          {formError}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-2 font-medium">
              Name *
            </label>
            <input
              id="name"
              type="text"
              className={`w-full p-2 border rounded ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <p className="mt-1 text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 font-medium">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className="w-full p-2 border border-gray-300 rounded"
              {...register('description')}
            />
          </div>

          <div>
            <label htmlFor="price" className="block mb-2 font-medium">
              Price *
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              className={`w-full p-2 border rounded ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('price', {
                required: 'Price is required',
                min: {
                  value: 0,
                  message: 'Price must be greater than or equal to 0',
                },
                setValueAs: (value) => ensureValidPrice(value),
              })}
            />
            {errors.price && (
              <p className="mt-1 text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="imageUrl" className="block mb-2 font-medium">
              Image URL
            </label>
            <input
              id="imageUrl"
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              {...register('imageUrl')}
              placeholder="Enter image URL or leave empty for default image"
            />
          </div>

          <div className="flex items-center">
            <input
              id="isAvailable"
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              {...register('isAvailable')}
            />
            <label htmlFor="isAvailable" className="ml-2 font-medium">
              Available for sale
            </label>
          </div>
        </div>

        {/* Additional Information and Image Preview */}
        <div className="space-y-4">
          <div>
            <label htmlFor="category" className="block mb-2 font-medium">
              Category
            </label>
            <input
              id="category"
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              {...register('category')}
            />
          </div>

          <div>
            <label htmlFor="brand" className="block mb-2 font-medium">
              Brand
            </label>
            <input
              id="brand"
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              {...register('brand')}
            />
          </div>

          <div>
            <label htmlFor="model" className="block mb-2 font-medium">
              Model
            </label>
            <input
              id="model"
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              {...register('model')}
            />
          </div>

          <div>
            <label htmlFor="year" className="block mb-2 font-medium">
              Year
            </label>
            <input
              id="year"
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              {...register('year')}
            />
          </div>

          {/* Image Preview */}
          {imagePreview ? (
            <div className="mt-4">
              <p className="font-medium mb-2">Image Preview:</p>
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full h-auto max-h-40 border border-gray-300 rounded"
                onError={() => setImagePreview(null)}
              />
            </div>
          ) : (
            <div className="mt-4">
              <p className="font-medium mb-2">No image provided:</p>
              <div className="max-w-full h-40 bg-gray-200 flex items-center justify-center border border-gray-300 rounded">
                <span className="text-gray-500">Default image will be used</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Saving...' : part ? 'Update Part' : 'Create Part'}
        </button>
      </div>
    </form>
  );
};

export default PartForm; 