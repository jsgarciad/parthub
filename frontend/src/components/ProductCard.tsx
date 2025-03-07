import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Button } from './ui/Button';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { id, name, price, discountPrice, images, brand, rating, stock, seller } = product;
  
  const handleAddToCart = () => {
    addToCart(product, 1);
  };
  
  const isDiscounted = discountPrice !== undefined && discountPrice < price;
  const discountPercentage = isDiscounted 
    ? Math.round(((price - discountPrice) / price) * 100) 
    : 0;
  
  return (
    <div className="group relative bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* Badge for discounted items */}
      {isDiscounted && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          {discountPercentage}% OFF
        </div>
      )}
      
      {/* Seller verification badge */}
      {seller.isVerified && (
        <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified
        </div>
      )}
      
      {/* Product image */}
      <Link to={`/products/${id}`} className="block overflow-hidden h-48">
        <img 
          src={images[0]} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      
      {/* Product info */}
      <div className="p-4">
        <div className="mb-2">
          <p className="text-sm text-gray-500 mb-1">{brand}</p>
          <Link to={`/products/${id}`} className="block">
            <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
              {name}
            </h3>
          </Link>
        </div>
        
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({rating})</span>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            {isDiscounted ? (
              <div className="flex items-center">
                <span className="text-lg font-bold text-gray-900">${discountPrice.toFixed(2)}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">${price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">${price.toFixed(2)}</span>
            )}
          </div>
          
          {/* Stock indicator */}
          <div className={`text-xs font-medium ${stock > 10 ? 'text-green-600' : stock > 0 ? 'text-orange-500' : 'text-red-600'}`}>
            {stock > 10 ? 'In Stock' : stock > 0 ? `Only ${stock} left` : 'Out of Stock'}
          </div>
        </div>
        
        {/* Add to cart button */}
        <Button 
          onClick={handleAddToCart} 
          fullWidth 
          disabled={stock === 0}
          size="sm"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}; 