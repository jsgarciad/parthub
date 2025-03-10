import React from 'react';
import { Link } from 'react-router-dom';
import { Part } from '../../types/models';
import ImageWithFallback from '../common/ImageWithFallback';

interface PartListProps {
  parts: Part[];
  isStore?: boolean;
  onEdit?: (part: Part) => void;
  onDelete?: (part: Part) => void;
}

/**
 * Component to display a list of parts
 */
const PartList: React.FC<PartListProps> = ({
  parts,
  isStore = false,
  onEdit,
  onDelete,
}) => {
  if (!parts || parts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No parts found.</p>
      </div>
    );
  }

  // Helper function to format price safely
  const formatPrice = (price: any): string => {
    // Check if price exists and is a number
    if (price === undefined || price === null) {
      return '0.00';
    }
    
    // Convert to number if it's a string
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Check if it's a valid number after conversion
    if (isNaN(numPrice)) {
      return '0.00';
    }
    
    // Format the price
    return numPrice.toFixed(2);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {parts.map((part) => (
        <div
          key={part.id}
          className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Part Image */}
          <div className="h-48 bg-gray-100 flex items-center justify-center">
            <ImageWithFallback
              src={part.imageUrl}
              alt={part.name}
              className="h-full w-full object-cover"
              useServerFallback={true}
            />
          </div>

          {/* Part Details */}
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{part.name || 'Unnamed Part'}</h3>
            
            <div className="mb-2 text-sm text-gray-600">
              {part.brand && <span className="mr-2">{part.brand}</span>}
              {part.model && <span className="mr-2">{part.model}</span>}
              {part.year && <span>{part.year}</span>}
            </div>
            
            {part.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {part.description}
              </p>
            )}
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-bold">${formatPrice(part.price)}</span>
              
              {part.isAvailable === false && (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-between">
              <Link
                to={`/parts/${part.id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                View Details
              </Link>

              {isStore && (
                <div className="space-x-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(part)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  )}
                  
                  {onDelete && (
                    <button
                      onClick={() => onDelete(part)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PartList; 