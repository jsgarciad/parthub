import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ImageWithFallback from '../components/common/ImageWithFallback';

/**
 * Cart page component
 */
const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link
            to="/parts"
            className="inline-block bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700"
          >
            Browse Parts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flow-root">
            <ul className="-my-6 divide-y divide-gray-200">
              {cart.items.map((item) => (
                <li key={item.part.id} className="py-6 flex">
                  {/* Item image */}
                  <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                    <ImageWithFallback
                      src={item.part.imageUrl}
                      alt={item.part.name}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>

                  {/* Item details */}
                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <Link to={`/parts/${item.part.id}`}>{item.part.name}</Link>
                        </h3>
                        <p className="ml-4">${(item.part.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.part.brand} {item.part.model} {item.part.year}
                      </p>
                    </div>
                    <div className="flex-1 flex items-end justify-between text-sm">
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="px-2 py-1 border border-gray-300 rounded-l-md"
                          onClick={() => updateQuantity(item.part.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-t border-b border-gray-300">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="px-2 py-1 border border-gray-300 rounded-r-md"
                          onClick={() => updateQuantity(item.part.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className="flex">
                        <button
                          type="button"
                          className="font-medium text-red-600 hover:text-red-500"
                          onClick={() => removeFromCart(item.part.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>${cart.totalPrice.toFixed(2)}</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            Shipping and taxes calculated at checkout.
          </p>
          <div className="mt-6">
            <Link
              to="/checkout"
              className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Checkout
            </Link>
          </div>
          <div className="mt-6 flex justify-between">
            <Link
              to="/parts"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Continue Shopping
            </Link>
            <button
              type="button"
              className="text-sm font-medium text-red-600 hover:text-red-500"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 