import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, LogIn } from 'lucide-react';
import { CheckoutContext } from '../../context/CheckoutContext';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import ContactInformation from './ContactInformation';
import ShippingAddress from './ShippingAddress';
import PaymentMethod from './PaymentMethod';

const Checkout = () => {
  const navigate = useNavigate();
  const { currentStep, goToStep } = useContext(CheckoutContext);
  const { cartItems, getTotalPrice } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="text-center">
          <LogIn className="w-20 h-20 mx-auto text-slate-400 mb-6" />
          <h2 className="text-3xl font-black text-slate-900 mb-3">Authentication Required</h2>
          <p className="text-slate-600 mb-8">Please log in to your account to proceed with checkout</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              Log In
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="inline-flex items-center gap-2 bg-slate-200 text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to cart if empty
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 mx-auto text-slate-300 mb-6" />
          <h2 className="text-3xl font-black text-slate-900 mb-3">Your cart is empty</h2>
          <p className="text-slate-600 mb-8">Add items to your cart before proceeding to checkout</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Shopping
          </button>
        </div>
      </div>
    );
  }

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 'contact':
        return (
          <ContactInformation
            onContinue={() => goToStep('shipping')}
          />
        );
      case 'shipping':
        return (
          <ShippingAddress
            onContinue={() => goToStep('payment')}
            onBack={() => goToStep('contact')}
          />
        );
      case 'payment':
        return (
          <PaymentMethod
            onBack={() => goToStep('shipping')}
            onSubmit={handleOrderSubmit}
          />
        );
      default:
        return <ContactInformation onContinue={() => goToStep('shipping')} />;
    }
  };

  const handleOrderSubmit = async (orderData) => {
    // This will be implemented with backend integration
    console.log('Order submitted:', orderData);
    // TODO: Submit order to backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b-2 border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center gap-2 text-primary hover:text-blue-700 font-bold transition-colors"
              aria-label="Back to cart"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Cart
            </button>
            <h1 className="text-2xl font-black text-slate-900">Secure Checkout</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Area */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <div className="mb-12 bg-white rounded-2xl p-6 border-2 border-slate-200">
              <div className="flex items-center justify-between">
                {['contact', 'shipping', 'payment'].map((step, index) => {
                  const stepLabels = {
                    contact: 'Contact',
                    shipping: 'Shipping',
                    payment: 'Payment'
                  };

                  const isCompleted = (current, target) => {
                    const steps = ['contact', 'shipping', 'payment'];
                    return steps.indexOf(current) > steps.indexOf(target);
                  };

                  const isActive = currentStep === step;
                  const completed = isCompleted(currentStep, step);

                  return (
                    <div key={step} className="flex items-center flex-1">
                      <button
                        onClick={() => {
                          // Allow clicking on completed steps
                          if (completed || isActive) {
                            goToStep(step);
                          }
                        }}
                        disabled={!completed && !isActive}
                        className={`relative flex flex-col items-center ${!completed && !isActive ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all ${
                            isActive
                              ? 'bg-primary text-white shadow-lg scale-110'
                              : completed
                              ? 'bg-green-500 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {completed ? '✓' : index + 1}
                        </div>
                        <span
                          className={`text-xs font-bold mt-2 uppercase tracking-widest ${
                            isActive
                              ? 'text-primary'
                              : completed
                              ? 'text-green-600'
                              : 'text-slate-400'
                          }`}
                        >
                          {stepLabels[step]}
                        </span>
                      </button>

                      {/* Connector */}
                      {index < 2 && (
                        <div
                          className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                            completed ? 'bg-green-500' : 'bg-slate-300'
                          }`}
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Step Content */}
            {renderStep()}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6">
                <h3 className="text-lg font-black tracking-wider">Order Summary</h3>
              </div>

              {/* Items */}
              <div className="p-6 max-h-64 overflow-y-auto border-b border-slate-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 mb-4 pb-4 border-b border-slate-100 last:border-0">
                    {item.product.mainImage && (
                      <img
                        src={item.product.mainImage}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Qty: <span className="font-bold text-slate-700">{item.quantity}</span>
                      </p>
                      <p className="text-sm font-black text-primary mt-1">
                        PKR {(item.product.discountPrice * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="font-bold">PKR {getTotalPrice().toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span>Shipping</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span>Tax (17% GST)</span>
                  <span className="font-bold">
                    PKR {Math.round(getTotalPrice() * 0.17).toLocaleString()}
                  </span>
                </div>

                <div className="border-t-2 border-slate-200 pt-4 flex justify-between items-center">
                  <span className="font-black text-lg text-slate-900">Total</span>
                  <span className="font-black text-2xl text-primary">
                    PKR {Math.round(getTotalPrice() * 1.17).toLocaleString()}
                  </span>
                </div>

                {/* Info Cards */}
                <div className="mt-6 space-y-3 text-xs text-slate-600">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex gap-2">
                    <span>✓</span>
                    <span>FREE shipping on orders over PKR 50,000</span>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
                    <span>🔒</span>
                    <span>Your payment information is secured and encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
