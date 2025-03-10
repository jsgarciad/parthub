import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RegisterRequest } from '../../types/models';

/**
 * Register form component
 */
const RegisterForm: React.FC = () => {
  const { register: registerUser, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userType, setUserType] = useState<'buyer' | 'store'>('buyer');
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegisterRequest>();

  // Handle user type change
  const handleUserTypeChange = (type: 'buyer' | 'store') => {
    setUserType(type);
    reset();
  };

  const onSubmit = async (data: RegisterRequest) => {
    setIsSubmitting(true);
    clearError();
    
    try {
      // If user type is buyer, remove store fields
      const formData = { ...data };
      if (userType === 'buyer') {
        formData.storeName = undefined;
        formData.address = undefined;
        formData.phone = undefined;
        formData.description = undefined;
      }
      
      // Add user type to the request
      formData.userType = userType;
      
      await registerUser(formData);
      
      // Navigate to appropriate page based on user type
      if (userType === 'store') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register Account</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* User Type Selection */}
      <div className="mb-6">
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              userType === 'buyer'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleUserTypeChange('buyer')}
          >
            Buyer Account
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              userType === 'store'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleUserTypeChange('store')}
          >
            Store Account
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* User Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">User Information</h3>
          
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 font-medium">
              Username *
            </label>
            <input
              id="username"
              type="text"
              className={`w-full p-2 border rounded ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('username', { required: 'Username is required' })}
            />
            {errors.username && (
              <p className="mt-1 text-red-500">{errors.username.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 font-medium">
              Password *
            </label>
            <input
              id="password"
              type="password"
              className={`w-full p-2 border rounded ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
            {errors.password && (
              <p className="mt-1 text-red-500">{errors.password.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`w-full p-2 border rounded ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && (
              <p className="mt-1 text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>
        
        {/* Store Information - Only show if store type is selected */}
        {userType === 'store' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Store Information</h3>
            
            <div className="mb-4">
              <label htmlFor="storeName" className="block mb-2 font-medium">
                Store Name *
              </label>
              <input
                id="storeName"
                type="text"
                className={`w-full p-2 border rounded ${
                  errors.storeName ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('storeName', { required: userType === 'store' ? 'Store name is required' : false })}
              />
              {errors.storeName && (
                <p className="mt-1 text-red-500">{errors.storeName.message}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="address" className="block mb-2 font-medium">
                Address
              </label>
              <input
                id="address"
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                {...register('address')}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="phone" className="block mb-2 font-medium">
                Phone
              </label>
              <input
                id="phone"
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                {...register('phone')}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block mb-2 font-medium">
                Description
              </label>
              <textarea
                id="description"
                className="w-full p-2 border border-gray-300 rounded"
                rows={3}
                {...register('description')}
              />
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p>
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm; 