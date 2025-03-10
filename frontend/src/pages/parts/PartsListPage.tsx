import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useParts } from '../../context/PartContext';
import PartList from '../../components/parts/PartList';

/**
 * Parts list page component
 */
const PartsListPage: React.FC = () => {
  const { parts, loading, error, fetchPublicParts } = useParts();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Extract search parameters
  useEffect(() => {
    const newFilters: Record<string, string> = {};
    
    // Get search query
    const search = searchParams.get('q');
    if (search) {
      newFilters.search = search;
    }
    
    // Get category filter
    const category = searchParams.get('category');
    if (category) {
      newFilters.category = category;
    }
    
    // Get brand filter
    const brand = searchParams.get('brand');
    if (brand) {
      newFilters.brand = brand;
    }
    
    // Get model filter
    const model = searchParams.get('model');
    if (model) {
      newFilters.model = model;
    }
    
    // Get year filter
    const year = searchParams.get('year');
    if (year) {
      newFilters.year = year;
    }
    
    setFilters(newFilters);
  }, [searchParams]);

  // Fetch parts when filters change
  useEffect(() => {
    fetchPublicParts(filters);
  }, [filters, fetchPublicParts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Auto Parts</h1>
        {Object.keys(filters).length > 0 && (
          <div className="mt-2 text-sm text-gray-500">
            Filters: {Object.entries(filters).map(([key, value]) => (
              <span key={key} className="mr-2">
                {key}: {value}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Filters Section */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-4">Filter Parts</h2>
        {/* Add filter components here */}
      </div>

      {/* Parts List */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading parts...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <PartList parts={parts} />
      )}
    </div>
  );
};

export default PartsListPage; 