import React, { useState } from 'react';
import { API_BASE_URL } from '../../config/api';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  useServerFallback?: boolean;
}

/**
 * Image component with fallback to a "NO IMAGE" placeholder
 */
const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackText = 'NO IMAGE',
  useServerFallback = true,
  className,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const serverFallbackUrl = `${API_BASE_URL}/no-image`;

  const handleError = () => {
    setHasError(true);
  };

  if (!src || (hasError && !useServerFallback)) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 text-gray-400 font-medium ${className}`}
        {...props}
      >
        {fallbackText}
      </div>
    );
  }

  if (hasError && useServerFallback) {
    return (
      <img
        src={serverFallbackUrl}
        alt={alt || fallbackText}
        className={className}
        {...props}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={handleError}
      className={className}
      {...props}
    />
  );
};

export default ImageWithFallback; 