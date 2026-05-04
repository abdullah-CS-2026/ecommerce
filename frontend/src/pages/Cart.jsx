import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.discountPrice * item.quantity), 0);
  const shipping = subtotal > 50000 ? 0 : 250;
  const tax = Math.round(subtotal * 0.17);
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center animate-fade-in-up">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Discover our top products and start shopping.</p>
        <Link to="/products" className="inline-flex items-center text-white bg-primary hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg transform hover:scale-105">
          Start Shopping <ArrowRight size={20} className="ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-4xl font-black text-slate-900 mb-10">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Cart Items List */}
        <div className="lg:w-2/3">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 text-sm font-black text-slate-600 uppercase tracking-widest">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="divide-y divide-slate-200">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center transition-colors hover:bg-slate-50">
                  {/* Mobile Product info */}
                  <div className="col-span-1 flex items-center justify-between sm:hidden mb-4">
                    <span className="font-black text-slate-900 text-sm">{item.product.name.substring(0, 20)}...</span>
                    <button onClick={() => removeFromCart(item.product._id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="sm:col-span-6 flex items-center space-x-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                      <img src={item.product.mainImage} alt={item.product.name} className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/150'} />
                    </div>
                    <div className="flex-1">
                      <Link to={`/products/${item.product._id}`} className="font-black text-slate-900 hover:text-primary transition-colors text-sm sm:text-base hidden sm:block">
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-slate-500 mt-1">{item.product.category}</p>
                      <p className="text-xs text-slate-400 mt-1">ID: {item.product._id}</p>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="sm:col-span-2 flex justify-between sm:justify-center items-center gap-2">
                    <span className="text-xs text-slate-500 sm:hidden font-medium">Qty:</span>
                    <div className="flex items-center border-2 border-slate-200 rounded-lg bg-white overflow-hidden">
                      <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="p-1.5 text-slate-500 hover:bg-slate-100 transition-all">
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="p-1.5 text-slate-500 hover:bg-slate-100 transition-all">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Unit Price - Mobile */}
                  <div className="sm:hidden text-right">
                    <p className="text-xs text-slate-500 mb-1">Price</p>
                    <p className="font-black text-slate-900">Rs. {item.product.discountPrice.toLocaleString()}</p>
                  </div>

                  {/* Unit Price - Desktop */}
                  <div className="sm:col-span-2 text-right hidden sm:block">
                    <p className="font-black text-slate-900">Rs. {item.product.discountPrice.toLocaleString()}</p>
                  </div>

                  {/* Total Price - Mobile */}
                  <div className="sm:hidden text-right border-t border-slate-200 pt-2">
                    <p className="font-black text-slate-900">Rs. {(item.product.discountPrice * item.quantity).toLocaleString()}</p>
                  </div>

                  {/* Total Price - Desktop */}
                  <div className="sm:col-span-2 text-right hidden sm:block font-black text-primary text-lg">
                    Rs. {(item.product.discountPrice * item.quantity).toLocaleString()}
                  </div>

                  {/* Remove Button - Mobile */}
                  <div className="sm:hidden">
                    <button onClick={() => removeFromCart(item.product._id)} className="w-full text-red-500 hover:text-red-700 py-2 px-4 border border-red-200 rounded-lg hover:bg-red-50 transition-all font-bold text-sm">
                      Remove
                    </button>
                  </div>

                  {/* Remove Button - Desktop */}
                  <div className="hidden sm:flex justify-end">
                    <button onClick={() => removeFromCart(item.product._id)} className="text-slate-400 hover:text-red-600 transition-colors bg-white hover:bg-red-50 p-2.5 rounded-lg border border-transparent hover:border-red-100 shadow-sm">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <Link to="/products" className="text-primary hover:text-blue-700 font-bold flex items-center transition-colors group">
              <ArrowRight size={18} className="mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3 mt-8 lg:mt-0">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-2xl p-6 md:p-8 shadow-lg sticky top-24">
            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center">
              💳 Order Summary
            </h2>

            <div className="space-y-5 text-sm text-slate-700 mb-8 border-b-2 border-slate-300 pb-8">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span className="font-black text-slate-900 text-base">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Shipping</span>
                {shipping === 0 ? (
                  <span className="font-black text-green-600 text-xs uppercase tracking-wider bg-green-50 px-3 py-1 rounded-full">FREE</span>
                ) : (
                  <span className="font-black text-slate-900">Rs. {shipping.toLocaleString()}</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Tax (17%)</span>
                <span className="font-black text-slate-900">Rs. {tax.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl border-2 border-primary/20">
              <span className="font-black text-lg text-slate-900">Total Amount</span>
              <span className="font-black text-3xl text-primary">Rs. {total.toLocaleString()}</span>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-primary to-blue-700 hover:shadow-2xl text-white py-4 px-6 rounded-lg font-black text-base transition-all shadow-lg flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-95">
              🔒 Proceed to Checkout <ArrowRight size={18} />
            </button>
            <div className="text-center mt-4">
              <p className="text-xs text-slate-600 flex items-center justify-center gap-1">
                ✓ Secure payment | Quick checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
