import React, { useState, useContext, useEffect, useRef } from 'react';
import { MapPin, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { CheckoutContext } from '../../context/CheckoutContext';

const ShippingAddress = ({ onContinue, onBack }) => {
  const { checkoutData, updateCheckoutData } = useContext(CheckoutContext);

  const firstInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: checkoutData.shipping.fullName || '',
    address: checkoutData.shipping.address || '',
    city: checkoutData.shipping.city || '',
    state: checkoutData.shipping.state || '',
    zipCode: checkoutData.shipping.zipCode || '',
    country: checkoutData.shipping.country || 'Pakistan'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Autofocus
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  // Validation rules
  const validators = {
    fullName: (value) => {
      if (!value.trim()) return 'Full name is required';
      if (value.trim().length < 3) return 'Full name must be at least 3 characters';
      if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Full name can only contain letters';
      return '';
    },
    address: (value) => {
      if (!value.trim()) return 'Address is required';
      if (value.trim().length < 5) return 'Please provide a complete street address';
      return '';
    },
    city: (value) => {
      if (!value.trim()) return 'City is required';
      if (value.trim().length < 2) return 'City must be at least 2 characters';
      return '';
    },
    state: (value) => {
      if (!value.trim()) return 'State/Province is required';
      if (value.trim().length < 2) return 'Please enter a valid state/province';
      return '';
    },
    zipCode: (value) => {
      if (!value.trim()) return 'Postal code is required';
      if (!/^[0-9a-zA-Z\-\s]{3,10}$/.test(value)) return 'Please enter a valid postal code';
      return '';
    }
  };

  // Handle field change
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));

    // Validate
    if (validators[field]) {
      const error = validators[field](value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  // Handle blur
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (validators[field]) {
      const error = validators[field](formData[field]);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
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
  const handleContinue = (e) => {
    e.preventDefault();

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
      firstInputRef.current?.focus();
      return;
    }

    // Save to context
    updateCheckoutData('shipping', formData);

    // Call parent callback
    if (onContinue) {
      onContinue(formData);
    }
  };

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
            2
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Shipping Address</h2>
            <p className="text-slate-500 text-sm mt-1">Where would you like it delivered?</p>
          </div>
        </div>
        <div className="h-1 w-24 bg-primary rounded-full"></div>
      </div>

      {/* Form */}
      <form onSubmit={handleContinue} className="bg-white border-2 border-slate-200 rounded-3xl p-8 sm:p-10 shadow-lg">
        
        {/* Full Name */}
        <div className="mb-8">
          <label htmlFor="fullName" className="block text-sm font-black text-slate-900 uppercase tracking-widest mb-3">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            ref={firstInputRef}
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            onBlur={() => handleBlur('fullName')}
            placeholder="John Doe"
            className={inputClass('fullName')}
            aria-label="Full Name"
            aria-invalid={touched.fullName && !!errors.fullName}
          />
          {errorMessage('fullName')}
          {successMessage('fullName')}
        </div>

        {/* Address */}
        <div className="mb-8">
          <label htmlFor="address" className="block text-sm font-black text-slate-900 uppercase tracking-widest mb-3">
            Street Address <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            onBlur={() => handleBlur('address')}
            placeholder="123 Main Street, Apartment 4B"
            rows="2"
            className={`${inputClass('address')} resize-none`}
            aria-label="Street Address"
            aria-invalid={touched.address && !!errors.address}
          />
          {errorMessage('address')}
          {successMessage('address')}
        </div>

        {/* City and State Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-black text-slate-900 uppercase tracking-widest mb-3">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              onBlur={() => handleBlur('city')}
              placeholder="Karachi"
              className={inputClass('city')}
              aria-label="City"
              aria-invalid={touched.city && !!errors.city}
            />
            {errorMessage('city')}
            {successMessage('city')}
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-sm font-black text-slate-900 uppercase tracking-widest mb-3">
              State/Province <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="state"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              onBlur={() => handleBlur('state')}
              placeholder="Sindh"
              className={inputClass('state')}
              aria-label="State or Province"
              aria-invalid={touched.state && !!errors.state}
            />
            {errorMessage('state')}
            {successMessage('state')}
          </div>
        </div>

        {/* Postal Code and Country Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {/* Postal Code */}
          <div>
            <label htmlFor="zipCode" className="block text-sm font-black text-slate-900 uppercase tracking-widest mb-3">
              Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              onBlur={() => handleBlur('zipCode')}
              placeholder="75500"
              className={inputClass('zipCode')}
              aria-label="Postal Code"
              aria-invalid={touched.zipCode && !!errors.zipCode}
            />
            {errorMessage('zipCode')}
            {successMessage('zipCode')}
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-black text-slate-900 uppercase tracking-widest mb-3">
              Country
            </label>
            <select
              id="country"
              value={formData.country}
              onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
              className="w-full px-4 py-3.5 text-base rounded-xl border-2 border-slate-300 hover:border-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all"
              aria-label="Country"
            >
              <option value="Pakistan">Pakistan</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-4 px-6 rounded-xl font-black text-lg uppercase tracking-wider transition-all border-2 border-slate-300 text-slate-900 hover:bg-slate-100"
            aria-label="Back to contact information"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className={`flex-1 py-4 px-6 rounded-xl font-black text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-3 ${
              isValid
                ? 'bg-gradient-to-r from-primary to-blue-700 text-white shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-95'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
            aria-label="Continue to payment method"
          >
            Continue to Payment
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingAddress;
