import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { productsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const productData = await productsApi.getById(id);
        setProduct(productData);
        
        // Fetch related products (same category)
        const relatedData = await productsApi.getByCategory(productData.category);
        setRelatedProducts(relatedData.filter(p => p.id !== id).slice(0, 4));
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  const handleQuantityChange = (value: number) => {
    if (product) {
      const newQuantity = Math.max(1, Math.min(value, product.stock));
      setQuantity(newQuantity);
    }
  };
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="md:flex md:items-start">
            <div className="md:w-1/2">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="mt-4 flex space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 w-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="mt-6 md:mt-0 md:ml-10 md:w-1/2">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded mb-6"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }
  
  const { 
    name, 
    description, 
    price, 
    discountPrice, 
    images, 
    category, 
    subcategory, 
    brand, 
    stock, 
    rating, 
    reviews, 
    seller,
    compatibleVehicles
  } = product;
  
  const isDiscounted = discountPrice !== undefined && discountPrice < price;
  const discountPercentage = isDiscounted 
    ? Math.round(((price - discountPrice) / price) * 100) 
    : 0;
  
  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex text-sm text-gray-500">
          <li>
            <Link to="/" className="hover:text-gray-900">Home</Link>
          </li>
          <li className="mx-2">/</li>
          <li>
            <Link to="/products" className="hover:text-gray-900">Products</Link>
          </li>
          <li className="mx-2">/</li>
          <li>
            <Link to={`/category/${category.toLowerCase()}`} className="hover:text-gray-900">{category}</Link>
          </li>
          {subcategory && (
            <>
              <li className="mx-2">/</li>
              <li>
                <Link to={`/category/${category.toLowerCase()}/${subcategory.toLowerCase()}`} className="hover:text-gray-900">{subcategory}</Link>
              </li>
            </>
          )}
          <li className="mx-2">/</li>
          <li className="text-gray-900 font-medium">{name}</li>
        </ol>
      </nav>
      
      {/* Product details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product images */}
          <div className="mb-8 lg:mb-0">
            <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-4 aspect-w-1 aspect-h-1">
              <img
                src={images[selectedImage]}
                alt={name}
                className="h-full w-full object-cover object-center"
              />
              {isDiscounted && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative rounded-md overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${name} - Image ${index + 1}`}
                    className="h-16 w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product info */}
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{name}</h1>
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="ml-2 text-sm text-gray-500">{rating} out of 5 stars ({reviews.length} reviews)</p>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center">
                  <p className="text-3xl font-bold text-gray-900">
                    ${isDiscounted ? discountPrice.toFixed(2) : price.toFixed(2)}
                  </p>
                  {isDiscounted && (
                    <p className="ml-3 text-lg text-gray-500 line-through">
                      ${price.toFixed(2)}
                    </p>
                  )}
                </div>
                
                <p className="mt-1 text-sm text-gray-500">
                  All prices include taxes.
                </p>
              </div>
              
              <div className="mt-4 flex items-center">
                <p className={`text-sm font-medium ${stock > 10 ? 'text-green-600' : stock > 0 ? 'text-orange-500' : 'text-red-600'}`}>
                  {stock > 10 ? 'In Stock' : stock > 0 ? `Only ${stock} left` : 'Out of Stock'}
                </p>
                <div className="ml-4 pl-4 border-l border-gray-300">
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500">Sold by</p>
                    <Link to={`/sellers/${seller.id}`} className="ml-1 text-sm font-medium text-blue-600 hover:text-blue-800">
                      {seller.name}
                    </Link>
                    {seller.isVerified && (
                      <svg className="ml-1 h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quantity selector */}
            <div className="mb-8">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="p-2 border border-gray-300 rounded-l-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="p-2 w-16 text-center border-t border-b border-gray-300 text-gray-900 focus:outline-none focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= stock}
                  className="p-2 border border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Add to cart button */}
            <div className="mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={stock === 0}
                fullWidth
                size="lg"
              >
                {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
            
            {/* Compatible vehicles */}
            {compatibleVehicles && compatibleVehicles.length > 0 && (
              <div className="mb-8 border rounded-md p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Compatible Vehicles</h3>
                <ul className="space-y-2">
                  {compatibleVehicles.map((vehicle, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {vehicle.make} {vehicle.model} ({vehicle.year}) - {vehicle.type === 'car' ? 'Car' : 'Motorcycle'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Shipping and returns */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center mb-2">
                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <p className="text-sm text-gray-600">Free shipping on orders over $50</p>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                </svg>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product tabs */}
      <div className="border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'description'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'specifications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reviews ({reviews.length})
              </button>
            </nav>
          </div>
          
          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600">{description}</p>
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <th className="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                        Brand
                      </th>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {brand}
                      </td>
                    </tr>
                    <tr>
                      <th className="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                        Category
                      </th>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {category}
                      </td>
                    </tr>
                    {subcategory && (
                      <tr>
                        <th className="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                          Subcategory
                        </th>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {subcategory}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <th className="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                        Seller
                      </th>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          {seller.name}
                          {seller.isVerified && (
                            <svg className="ml-1 h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-center mb-2">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium">
                            {review.userName.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{review.userName}</p>
                            <div className="flex items-center mt-1">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <svg 
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.floor(review.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <p className="ml-2 text-xs text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 