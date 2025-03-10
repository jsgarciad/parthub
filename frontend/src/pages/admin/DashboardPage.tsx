import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParts } from '../../context/PartContext';
import { useAuth } from '../../context/AuthContext';
import PartList from '../../components/parts/PartList';
import PartForm from '../../components/parts/PartForm';
import { Part, PartRequest } from '../../types/models';

/**
 * Dashboard page component for store owners
 */
const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { storeParts, loading, error, fetchStoreParts, createPart, updatePart, deletePart } = useParts();
  const [isAddingPart, setIsAddingPart] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch store parts on mount
  useEffect(() => {
    fetchStoreParts().catch(err => {
      console.error('Error fetching store parts:', err);
      // If unauthorized, redirect to login
      if (err.message && err.message.includes('Authentication required')) {
        logout();
        navigate('/login');
      }
    });
  }, [fetchStoreParts, logout, navigate]);

  // Handle part creation
  const handleCreatePart = async (data: PartRequest) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      await createPart(data);
      setIsAddingPart(false);
    } catch (error) {
      console.error('Error creating part:', error);
      
      // Handle authentication errors
      if (error instanceof Error) {
        setFormError(error.message);
        
        // If unauthorized, redirect to login
        if (error.message.includes('Authentication required') || 
            error.message.includes('Unauthorized')) {
          logout();
          navigate('/login');
        }
      } else {
        setFormError('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle part update
  const handleUpdatePart = async (data: PartRequest) => {
    if (!editingPart) return;
    
    setIsSubmitting(true);
    setFormError(null);
    try {
      await updatePart(editingPart.id, data);
      setEditingPart(null);
    } catch (error) {
      console.error('Error updating part:', error);
      
      // Handle authentication errors
      if (error instanceof Error) {
        setFormError(error.message);
        
        // If unauthorized, redirect to login
        if (error.message.includes('Authentication required') || 
            error.message.includes('Unauthorized')) {
          logout();
          navigate('/login');
        }
      } else {
        setFormError('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle part deletion
  const handleDeletePart = async (part: Part) => {
    if (window.confirm(`Are you sure you want to delete "${part.name}"?`)) {
      try {
        await deletePart(part.id);
      } catch (error) {
        console.error('Error deleting part:', error);
        
        // Handle authentication errors
        if (error instanceof Error) {
          // If unauthorized, redirect to login
          if (error.message.includes('Authentication required') || 
              error.message.includes('Unauthorized')) {
            logout();
            navigate('/login');
          }
        }
      }
    }
  };

  // Handle edit button click
  const handleEditClick = (part: Part) => {
    setEditingPart(part);
    setIsAddingPart(false);
    setFormError(null);
  };

  // Handle cancel button click
  const handleCancel = () => {
    setIsAddingPart(false);
    setEditingPart(null);
    setFormError(null);
  };

  // Check if user has a store
  if (!user?.store) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-red-600 mb-4">Store Required</h2>
          <p className="text-gray-700 mb-4">
            You need to have a store to access the dashboard. Please contact support if you believe this is an error.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Dashboard</h1>
          {user?.store && (
            <p className="text-gray-600 mt-1">{user.store.name}</p>
          )}
        </div>
        
        {!isAddingPart && !editingPart && (
          <button
            onClick={() => setIsAddingPart(true)}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Add New Part
          </button>
        )}
      </div>

      {/* Form for adding/editing parts */}
      {(isAddingPart || editingPart) && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {editingPart ? 'Edit Part' : 'Add New Part'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
          
          {formError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {formError}
            </div>
          )}
          
          <PartForm
            part={editingPart || undefined}
            onSubmit={editingPart ? handleUpdatePart : handleCreatePart}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {/* Parts list */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Your Parts</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading your parts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => fetchStoreParts()}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : storeParts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">You don't have any parts yet.</p>
            {!isAddingPart && (
              <button
                onClick={() => setIsAddingPart(true)}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Add Your First Part
              </button>
            )}
          </div>
        ) : (
          <PartList
            parts={storeParts}
            isStore={true}
            onEdit={handleEditClick}
            onDelete={handleDeletePart}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage; 