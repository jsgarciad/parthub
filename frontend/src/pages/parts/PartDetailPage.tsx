import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useParts } from '../../context/PartContext';
import { useCart } from '../../context/CartContext';
import ImageWithFallback from '../../components/common/ImageWithFallback';

/**
 * Part detail page component
 */
const PartDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedPart, loading, error, fetchPart } = useParts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchPart(id);
    }
  }, [id, fetchPart]);

  const handleAddToCart = () => {
    if (selectedPart) {
      addToCart(selectedPart, quantity);
      setAddedToCart(true);
      
      // Reset the added to cart message after 3 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    }
  };

  const handleBuyNow = () => {
    if (selectedPart) {
      addToCart(selectedPart, quantity);
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-8">
          <p className="text-gray-500">Loading part details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <Link to="/parts" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to parts
          </Link>
        </div>
      </div>
    );
  }

  if (!selectedPart) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-8">
          <p className="text-gray-500">Part not found</p>
          <Link to="/parts" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to parts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6">
        <ol className="flex text-sm text-gray-500">
          <li>
            <Link to="/" className="hover:text-gray-700">
              Home
            </Link>
          </li>
          <li className="mx-2">/</li>
          <li>
            <Link to="/parts" className="hover:text-gray-700">
              Parts
            </Link>
          </li>
          <li className="mx-2">/</li>
          <li className="text-gray-900 font-medium">{selectedPart.name}</li>
        </ol>
      </nav>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="md:flex">
          {/* Part Image */}
          <div className="md:w-1/2 p-4">
            <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
              <ImageWithFallback
                src={selectedPart.imageUrl}
                alt={selectedPart.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          {/* Part Details */}
          <div className="md:w-1/2 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedPart.name}</h1>
            
            <div className="mb-4">
              {selectedPart.brand && (
                <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  {selectedPart.brand}
                </span>
              )}
              {selectedPart.model && (
                <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  {selectedPart.model}
                </span>
              )}
              {selectedPart.year && (
                <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  {selectedPart.year}
                </span>
              )}
              {selectedPart.category && (
                <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  {selectedPart.category}
                </span>
              )}
            </div>
            
            <div className="mb-6">
              <p className="text-3xl font-bold text-gray-900">${selectedPart.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">
                {selectedPart.isAvailable ? (
                  <span className="text-green-600">In Stock</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </p>
            </div>
            
            {selectedPart.description && (
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Description</h2>
                <p className="text-gray-700">{selectedPart.description}</p>
              </div>
            )}
            
            {selectedPart.store && (
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Seller</h2>
                <p className="text-gray-700">{selectedPart.store.name}</p>
              </div>
            )}
            
            {selectedPart.isAvailable && (
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Quantity</h2>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 border border-gray-300 rounded-l-md"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-t border-b border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 border border-gray-300 rounded-r-md"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            
            {addedToCart && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                Added to cart successfully!
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleAddToCart}
                disabled={!selectedPart.isAvailable}
                className={`py-3 px-4 rounded-md font-medium text-white ${
                  selectedPart.isAvailable
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Add to Cart
              </button>
              
              <button
                onClick={handleBuyNow}
                disabled={!selectedPart.isAvailable}
                className={`py-3 px-4 rounded-md font-medium ${
                  selectedPart.isAvailable
                    ? 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                    : 'bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed'
                }`}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartDetailPage; 