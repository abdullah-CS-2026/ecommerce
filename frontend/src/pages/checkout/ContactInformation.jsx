import React, { useState, useContext, useEffect, useRef } from 'react';
import { Mail, Phone, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { CheckoutContext } from '../../context/CheckoutContext';
import { AuthContext } from '../../context/AuthContext';

const ContactInformation = ({ onContinue }) => {
  const { user } = useContext(AuthContext);
  const { checkoutData, updateCheckoutData } = useContext(CheckoutContext);
  
  const emailInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    email: checkoutData.contact.email || user?.email || '',
    phone: checkoutData.contact.phone || '',
    marketingOptIn: checkoutData.contact.marketingOptIn || false
  });

  const [errors, setErrors] = useState({
    email: ''
  });

  const [touched, setTouched] = useState({
    email: false,
    phone: false
  });

  const [isValid, setIsValid] = useState(false);

  // Autofocus on mount
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone format (basic - allows numbers, +, -, (), spaces)
  const validatePhone = (phone) => {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^[\d\s+\-()]*$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  // Handle email change
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData(prev => ({ ...prev, email }));
    setTouched(prev => ({ ...prev, email: true }));

    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Email address is required' }));
    } else if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  // Handle phone change
  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    setFormData(prev => ({ ...prev, phone }));
    setTouched(prev => ({ ...prev, phone: true }));

    if (phone && !validatePhone(phone)) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid phone number' }));
    } else if (phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  // Handle blur
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Check form validity
  useEffect(() => {
    const isEmailValid = formData.email && validateEmail(formData.email);
    const isPhoneValid = !formData.phone || validatePhone(formData.phone);
    setIsValid(isEmailValid && isPhoneValid);
  }, [formData]);

  // Handle form submission
  const handleContinue = (e) => {
    e.preventDefault();

    // Final validation
    if (!formData.email || !validateEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      setTouched(prev => ({ ...prev, email: true }));
      emailInputRef.current?.focus();
      return;
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid phone number' }));
      setTouched(prev => ({ ...prev, phone: true }));
      return;
    }

    // Save data to context
    updateCheckoutData('contact', formData);

    // Call parent callback
    if (onContinue) {
      onContinue(formData);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Step Header */}
      <div className="mb-10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black text-lg">
            1
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Contact Information</h2>
            <p className="text-slate-500 text-sm mt-1">Where can we reach you?</p>
          </div>
        </div>
        <div className="h-1 w-24 bg-primary rounded-full"></div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleContinue} className="bg-white border-2 border-slate-200 rounded-3xl p-8 sm:p-10 shadow-lg">
        
        {/* Email Field */}
        <div className="mb-8">
          <label htmlFor="email" className="block text-sm font-black text-slate-900 uppercase tracking-widest mb-3">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              ref={emailInputRef}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleEmailChange}
              onBlur={() => handleBlur('email')}
              placeholder="your@email.com"
              className={`w-full pl-12 pr-4 py-3.5 text-base rounded-xl border-2 transition-all outline-none focus:ring-4 focus:ring-primary/20 ${
                touched.email && errors.email
                  ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100'
                  : touched.email && !errors.email
                  ? 'border-green-400 bg-green-50 focus:border-green-500'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
              required
              aria-label="Email Address"
              aria-describedby="email-error"
              aria-invalid={touched.email && !!errors.email}
            />
          </div>

          {/* Error Message */}
          {touched.email && errors.email && (
            <div className="mt-3 flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium" id="email-error">{errors.email}</span>
            </div>
          )}

          {/* Success Message */}
          {touched.email && !errors.email && formData.email && (
            <div className="mt-3 flex items-center space-x-2 text-green-600">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">Email looks good!</span>
            </div>
          )}
        </div>

        {/* Phone Field */}
        <div className="mb-8">
          <label htmlFor="phone" className="block text-sm font-black text-slate-900 uppercase tracking-widest mb-3">
            Phone Number <span className="text-slate-400">(optional)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              onBlur={() => handleBlur('phone')}
              placeholder="+1 (555) 000-0000"
              className={`w-full pl-12 pr-4 py-3.5 text-base rounded-xl border-2 transition-all outline-none focus:ring-4 focus:ring-primary/20 ${
                touched.phone && errors.phone
                  ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100'
                  : touched.phone && formData.phone && !errors.phone
                  ? 'border-green-400 bg-green-50 focus:border-green-500'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
              aria-label="Phone Number"
              aria-describedby="phone-error"
              aria-invalid={touched.phone && !!errors.phone}
            />
          </div>

          {/* Phone Helper Text */}
          {!touched.phone || !formData.phone ? (
            <p className="mt-2 text-sm text-slate-500">International formats supported (e.g., +1, +44, +91)</p>
          ) : null}

          {/* Error Message */}
          {touched.phone && errors.phone && (
            <div className="mt-3 flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium" id="phone-error">{errors.phone}</span>
            </div>
          )}

          {/* Success Message */}
          {touched.phone && formData.phone && !errors.phone && (
            <div className="mt-3 flex items-center space-x-2 text-green-600">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">Phone number is valid!</span>
            </div>
          )}
        </div>

        {/* Marketing Opt-in Checkbox */}
        <div className="mb-10 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
          <label className="flex items-start cursor-pointer group">
            <input
              type="checkbox"
              name="marketingOptIn"
              checked={formData.marketingOptIn}
              onChange={(e) => setFormData(prev => ({ ...prev, marketingOptIn: e.target.checked }))}
              className="w-5 h-5 text-primary border-2 border-slate-300 rounded-lg cursor-pointer mt-0.5 focus:ring-4 focus:ring-primary/20 transition-all"
              aria-label="Opt-in to marketing emails"
            />
            <div className="ml-4">
              <p className="font-bold text-slate-900 text-base group-hover:text-primary transition-colors">
                📧 Email me with news and offers
              </p>
              <p className="text-sm text-slate-600 mt-1">
                Stay updated with exclusive deals, new arrivals, and special offers from ElectroMart.
              </p>
            </div>
          </label>
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-4 px-6 rounded-xl font-black text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-3 ${
            isValid
              ? 'bg-gradient-to-r from-primary to-blue-700 text-white shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-95'
              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
          }`}
          aria-label="Continue to shipping address"
        >
          Continue to Shipping
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Help Text */}
        <p className="text-center text-sm text-slate-500 mt-6">
          🔒 Your information is secure and encrypted
        </p>
      </form>

      {/* Login Link */}
      {!user && (
        <div className="mt-8 text-center bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200">
          <p className="text-slate-700 mb-2">Already have an account?</p>
          <a href="/login" className="text-primary hover:text-blue-700 font-bold text-lg transition-colors">
            Sign in to your account →
          </a>
        </div>
      )}
    </div>
  );
};

export default ContactInformation;
