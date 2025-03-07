import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  
  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    updateQuantity(productId, quantity);
  };
  
  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };
  
  const handleApplyCoupon = () => {
    // In a real app, this would be an API call to validate the coupon
    if (couponCode.toLowerCase() === 'discount10') {
      setCouponDiscount(10);
      setCouponError('');
    } else if (couponCode.toLowerCase() === 'discount20') {
      setCouponDiscount(20);
      setCouponError('');
    } else {
      setCouponDiscount(0);
      setCouponError('Invalid coupon code');
    }
  };
  
  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };
  
  const subtotal = cart.totalAmount;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const discount = (subtotal * couponDiscount) / 100;
  const total = subtotal + shipping - discount;
  
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        {cart.items.length === 0 ? (
          <div className="text-center py-12">
            <svg 
              className="mx-auto h-16 w-16 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
              />
            </svg>
            <h2 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-500">
              Looks like you haven't added any products to your cart yet.
            </p>
            <div className="mt-6">
              <Link to="/products">
                <Button>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-8">
              {/* Cart items */}
              <div className="border-t border-b border-gray-200 divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <div key={item.product.id} className="py-6 flex">
                    <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                    
                    <div className="ml-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <Link to={`/products/${item.product.id}`} className="hover:text-blue-600">
                              {item.product.name}
                            </Link>
                          </h3>
                          <p className="ml-4">
                            ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Brand: {item.product.brand}</p>
                        {item.product.discountPrice && (
                          <p className="mt-1 text-sm text-red-500">
                            Sale: ${item.product.discountPrice.toFixed(2)} (Regular: ${item.product.price.toFixed(2)})
                          </p>
                        )}
                      </div>
                      
                      <div className="flex-1 flex items-end justify-between text-sm">
                        <div className="flex items-center">
                          <label htmlFor={`quantity-${item.product.id}`} className="mr-2 text-gray-500">
                            Qty
                          </label>
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                              className="p-1 text-gray-600 hover:text-gray-800"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <input
                              id={`quantity-${item.product.id}`}
                              type="number"
                              min="1"
                              max={item.product.stock}
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value) || 1)}
                              className="w-12 text-center p-1 text-gray-900 focus:outline-none focus:ring-0"
                            />
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="font-medium text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Continue shopping */}
              <div className="mt-6">
                <Link to="/products" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>
            
            {/* Order summary */}
            <div className="mt-12 lg:mt-0 lg:col-span-4">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="text-gray-900 font-medium">${subtotal.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-gray-600">Shipping</p>
                    <p className="text-gray-900 font-medium">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </p>
                  </div>
                  
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <p>Discount ({couponDiscount}%)</p>
                      <p>-${discount.toFixed(2)}</p>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <p className="text-lg font-medium text-gray-900">Total</p>
                    <p className="text-lg font-bold text-gray-900">${total.toFixed(2)}</p>
                  </div>
                </div>
                
                {/* Coupon code */}
                <div className="mt-6">
                  <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">
                    Coupon Code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="mt-1 text-sm text-red-600">{couponError}</p>
                  )}
                  {couponDiscount > 0 && (
                    <p className="mt-1 text-sm text-green-600">Coupon applied successfully!</p>
                  )}
                </div>
                
                {/* Checkout button */}
                <div className="mt-6">
                  <Button
                    onClick={handleCheckout}
                    fullWidth
                    size="lg"
                  >
                    {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                  </Button>
                </div>
                
                {/* Secure checkout */}
                <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                  <svg className="h-5 w-5 text-gray-400 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p>Secure checkout</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 