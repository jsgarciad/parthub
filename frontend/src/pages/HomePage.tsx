import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParts } from '../context/PartContext';
import PartList from '../components/parts/PartList';
import ImageWithFallback from '../components/common/ImageWithFallback';

/**
 * Home page component
 */
const HomePage: React.FC = () => {
  const { parts, loading, error, fetchPublicParts, retryFetch } = useParts();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchPublicParts();
  }, [fetchPublicParts]);

  // Handle retry button click
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    retryFetch();
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Find the right auto parts for your vehicle
              </h1>
              <p className="text-xl mb-6">
                PartHub connects you with local stores selling the parts you need
              </p>
              <Link
                to="/parts"
                className="inline-block bg-white text-blue-600 font-medium py-3 px-6 rounded-md hover:bg-blue-50"
              >
                Browse Parts
              </Link>
            </div>
            <div className="md:w-1/2">
              <ImageWithFallback
                src="/public/no-image.svg"
                alt="Auto Parts"
                className="rounded-lg shadow-lg h-64 w-full object-cover"
                fallbackText="AUTO PARTS"
                useServerFallback={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Parts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Parts</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-8 mb-4 rounded-full bg-blue-200"></div>
              <p className="text-gray-500">Loading parts...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              Try Again
            </button>
          </div>
        ) : parts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No parts available at the moment.</p>
            <p className="text-gray-500 mb-6">Be the first to list your auto parts!</p>
            <Link
              to="/register"
              className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700"
            >
              Register as a Store
            </Link>
          </div>
        ) : (
          <PartList parts={parts.slice(0, 6)} />
        )}
        
        {parts.length > 0 && (
          <div className="text-center mt-8">
            <Link
              to="/parts"
              className="inline-block bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700"
            >
              View All Parts
            </Link>
          </div>
        )}
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Search for Parts</h3>
              <p className="text-gray-600">
                Browse our extensive catalog of auto parts or search for specific items
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Contact the Seller</h3>
              <p className="text-gray-600">
                Connect directly with local stores that have the parts you need
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Get Your Parts</h3>
              <p className="text-gray-600">
                Pick up your parts or arrange delivery with the store
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* For Stores Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-blue-50 rounded-lg p-8 md:flex md:items-center">
          <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Are you a store owner?
            </h2>
            <p className="text-gray-600 mb-4">
              Join PartHub to list your inventory and connect with customers looking for auto parts.
            </p>
            <Link
              to="/register"
              className="inline-block bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700"
            >
              Register Your Store
            </Link>
          </div>
          <div className="md:w-1/3">
            <ImageWithFallback
              src="/public/no-image.svg"
              alt="Store Owner"
              className="rounded-lg h-48 w-full object-cover"
              fallbackText="STORE OWNER"
              useServerFallback={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 