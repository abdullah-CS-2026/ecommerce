import React, { useState, useContext, useEffect, useRef } from 'react';
import { CreditCard, AlertCircle, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { CheckoutContext } from '../../context/CheckoutContext';
import { CartContext } from '../../context/CartContext';

const PaymentMethod = ({ onBack, onSubmit }) => {
  const { checkoutData, updateCheckoutData, clearCheckoutData } = useContext(CheckoutContext);
  const { getTotalPrice, clearCart } = useContext(CartContext);

  const firstInputRef = useRef(null);

  const [formData, setFormData] = useState({
    cardNumber: checkoutData.payment.cardNumber || '',
    cardName: checkoutData.payment.cardName || '',
    expiryDate: checkoutData.payment.expiryDate || '',
    cvv: checkoutData.payment.cvv || ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCvvHint, setShowCvvHint] = useState(false);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  // Validators
  const validators = {
    cardNumber: (value) => {
      const cleaned = value.replace(/\s/g, '');
      if (!cleaned) return 'Card number is required';
      if (!/^\d{16}$/.test(cleaned)) return 'Card number must be 16 digits';
      // Luhn algorithm
      let sum = 0;
      for (let i = 0; i < cleaned.length; i++) {
        let digit = parseInt(cleaned[cleaned.length - 1 - i], 10);
        if (i % 2 === 1) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
      }
      if (sum % 10 !== 0) return 'Invalid card number';
      return '';
    },
    cardName: (value) => {
      if (!value.trim()) return 'Cardholder name is required';
      if (value.trim().length < 3) return 'Name must be at least 3 characters';
      if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Name can only contain letters';
      return '';
    },
    expiryDate: (value) => {
      if (!value) return 'Expiry date is required';
      const [month, year] = value.split('/');
      if (!month || !year) return 'Format: MM/YY';
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);
      if (m < 1 || m > 12) return 'Invalid month';
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      if (y < currentYear || (y === currentYear && m < currentMonth)) {
        return 'Card has expired';
      }
      return '';
    },
    cvv: (value) => {
      if (!value) return 'CVV is required';
      if (!/^\d{3,4}$/.test(value)) return 'CVV must be 3-4 digits';
      return '';
    }
  };

  // Format card number (add spaces every 4 digits)
  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  // Handle card number change
  const handleCardNumberChange = (e) => {
    const value = formatCardNumber(e.target.value);
    if (value.replace(/\s/g, '').length <= 16) {
      setFormData(prev => ({ ...prev, cardNumber: value }));
      setTouched(prev => ({ ...prev, cardNumber: true }));
      const error = validators.cardNumber(value);
      setErrors(prev => ({ ...prev, cardNumber: error }));
    }
  };

  // Handle expiry date change
  const handleExpiryChange = (e) => {
    const value = formatExpiryDate(e.target.value);
    if (value.length <= 5) {
      setFormData(prev => ({ ...prev, expiryDate: value }));
      setTouched(prev => ({ ...prev, expiryDate: true }));
      const error = validators.expiryDate(value);
      setErrors(prev => ({ ...prev, expiryDate: error }));
    }
  };

  // Handle change
  const handleChange = (field, value) => {
    if (field === 'cvv' && value.length > 4) return;
    if (field === 'cvv') value = value.replace(/\D/g, '');

    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));

    const error = validators[field](value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Check validity
  useEffect(() => {
    const isFormValid = Object.keys(validators).every(field => {
      const error = validators[field](formData[field]);
      return !error;
    });
    setIsValid(isFormValid);
  }, [formData]);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    let newErrors = {};
    Object.keys(validators).forEach(field => {
      const error = validators[field](formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.keys(newErrors).forEach(field => {
        setTouched(prev => ({ ...prev, [field]: true }));
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Save payment data to context
      updateCheckoutData('payment', formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call parent callback
      if (onSubmit) {
        await onSubmit({
          contact: checkoutData.contact,
          shipping: checkoutData.shipping,
          payment: formData
        });
      }

      // Clear checkout data after successful submission
      clearCheckoutData();
      clearCart();

      // You would normally navigate to order confirmation here
      // navigate('/order-confirmation');
    } catch (error) {
      console.error('Payment error:', error);
      setErrors(prev => ({ ...prev, submit: 'Payment failed. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = Math.round(getTotalPrice() * 1.17);

  const inputClass = (field) => {
    const hasError = touched[field] && errors[field];
    const isValid = touched[field] && !errors[field] && formData[field];

    return `w-full px-4 py-3.5 text-base rounded-xl border-2 transition-all outline-none focus:ring-4 focus:ring-primary/20 ${
      hasError
        ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100'
        : isValid
        ? 'border-green-400 bg-green-50 focus:border-green-500'
        : 'border-slate-300 hover:border-slate-400'
    }`;
  };

  const errorMessage = (field) => {
    if (touched[field] && errors[field]) {
      return (
        <div className="mt-3 flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">{errors[field]}</span>
        </div>
      );
    }
    return null;
  };

  const successMessage = (field) => {
    if (touched[field] && !errors[field] && formData[field]) {
      return (
        <div className="mt-3 flex items-center space-x-2 text-green-600">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">✓</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Step Header */}
      <div className="mb-10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black text-lg">
            3
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Payment Method</h2>
            <p className="text-slate-500 text-sm mt-1">Complete your purchase securely</p>
          </div>
        </div>
        <div className="h-1 w-24 bg-primary rounded-full"></div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border-2 border-slate-200 rounded-3xl p-8 sm:p-10 shadow-lg">
        
        {/* Card Preview */}
        <div className="mb-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex justify-between items-start mb-12">
            <CreditCard className="w-8 h-8" />
            <Lock className="w-5 h-5 text-blue-200" />
          </div>
          <p className="text-sm text-blue-200 mb-2 font-mono">
            {formData.cardNumber || '•••• •••• •••• ••••'}
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-blue-200">CARD HOLDER</p>
              <p className="font-bold text-sm mt-1 uppercase">
                {formData.cardName || 'YOUR NAME'}
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-200">EXPIRES</p>
              <p className="font-bold text-sm mt-1">
                {formData.expiryDate || 'MM/YY'}
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-200">CVV</p>
              <p className="font-bold text-sm mt-1">
                {formData.cvv ? '•••' : 'CVC'}
              </p>
            </div>
          </div>
        </div>

        {/* Card Number */}
        <div className="mb-8">
          <label htmlFor="cardNumber" className="block text-sm font-black text-slate-900 uppercase tracking-widest mb-3">
            Card Number <span className="text-red-500">*</span>
          </label>
          <input
            ref={firstInputRef}
            type="text"
            id="cardNumber"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            onBlur={() => setTouched(prev => ({ ...prev, cardNumber: true }))}
            placeholder="1234 5678 9012 3456"
            inputMode="numeric"
            className={inputClass('cardNumber')}
            aria-label="Card Number"
            aria-invalid={touched.cardNumber && !!errors.cardNumber}
          />
          {errorMessage('cardNumber')}
          {successMessage('cardNumber')}
        </div>

        {/* Cardholder Name */}
        <div className="mb-8">
          <label htmlFor="cardName" className="block text-sm font-black text-slate-900 uppercase tracking-widest mb-3">
            Cardholder Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="cardName"
            value={formData.cardName}
            onChange={(e) => handleChange('cardName', e.target.value)}
            onBlur={() => setTouched(prev => ({ ...prev, cardName: true }))}
            placeholder="John Doe"
            className={inputClass('cardName')}
            aria-label="Cardholder Name"
            aria-invalid={touched.cardName && !!errors.cardName}
          />
          {errorMessage('cardName')}
          {successMessage('cardName')}
        </div>

        {/* Expiry and CVV Row */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          {/* Expiry Date */}
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-black text-slate-900 uppercase tracking-widest mb-3">
              Expiry Date <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="expiryDate"
              value={formData.expiryDate}
              onChange={handleExpiryChange}
              onBlur={() => setTouched(prev => ({ ...prev, expiryDate: true }))}
              placeholder="MM/YY"
              inputMode="numeric"
              maxLength="5"
              className={inputClass('expiryDate')}
              aria-label="Expiry Date"
              aria-invalid={touched.expiryDate && !!errors.expiryDate}
            />
            {errorMessage('expiryDate')}
            {successMessage('expiryDate')}
          </div>

          {/* CVV */}
          <div>
            <label htmlFor="cvv" className="block text-sm font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center justify-between">
              <span>CVV <span className="text-red-500">*</span></span>
              <button
                type="button"
                onClick={() => setShowCvvHint(!showCvvHint)}
                className="text-xs text-primary hover:text-blue-700 font-bold"
                aria-label="CVV help"
              >
                ?
              </button>
            </label>
            <input
              type="text"
              id="cvv"
              value={formData.cvv}
              onChange={(e) => handleChange('cvv', e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, cvv: true }))}
              placeholder="123"
              inputMode="numeric"
              maxLength="4"
              className={inputClass('cvv')}
              aria-label="CVV"
              aria-invalid={touched.cvv && !!errors.cvv}
            />
            {showCvvHint && (
              <p className="text-xs text-slate-500 mt-2 italic">
                The 3-4 digit security code on the back of your card
              </p>
            )}
            {errorMessage('cvv')}
            {successMessage('cvv')}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mb-10 bg-green-50 border-2 border-green-200 rounded-2xl p-6">
          <div className="flex gap-3">
            <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-green-900">Your payment is secure</p>
              <p className="text-sm text-green-700 mt-1">
                Your payment information is encrypted and secured using industry-standard SSL/TLS protocols. We never store full card details.
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-slate-50 rounded-2xl p-6 mb-10 border border-slate-200">
          <h4 className="font-black text-slate-900 mb-4">Order Total</h4>
          <div className="flex justify-between items-center py-3 border-b border-slate-200 mb-3">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-bold">PKR {getTotalPrice().toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-slate-200 mb-3">
            <span className="text-slate-600">Tax (17%)</span>
            <span className="font-bold">PKR {Math.round(getTotalPrice() * 0.17).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="font-black text-lg text-slate-900">Total</span>
            <span className="font-black text-2xl text-primary">PKR {total.toLocaleString()}</span>
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 font-medium">{errors.submit}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="flex-1 py-4 px-6 rounded-xl font-black text-lg uppercase tracking-wider transition-all border-2 border-slate-300 text-slate-900 hover:bg-slate-100 disabled:opacity-50"
            aria-label="Back to shipping address"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`flex-1 py-4 px-6 rounded-xl font-black text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-3 ${
              isValid && !isSubmitting
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-95'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
            aria-label="Complete purchase"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                Complete Purchase
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-slate-500 mt-6">
          By clicking "Complete Purchase", you agree to our Terms & Conditions
        </p>
      </form>
    </div>
  );
};

export default PaymentMethod;
