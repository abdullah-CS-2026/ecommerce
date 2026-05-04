import React, { createContext, useState } from 'react';

export const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const [checkoutData, setCheckoutData] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('checkoutData');
    return saved ? JSON.parse(saved) : {
      contact: {
        email: '',
        phone: '',
        marketingOptIn: false
      },
      shipping: {
        fullName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      payment: {
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
      }
    };
  });

  const [currentStep, setCurrentStep] = useState('contact');

  const updateCheckoutData = (step, data) => {
    const updatedData = {
      ...checkoutData,
      [step]: { ...checkoutData[step], ...data }
    };
    setCheckoutData(updatedData);
    localStorage.setItem('checkoutData', JSON.stringify(updatedData));
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const clearCheckoutData = () => {
    const empty = {
      contact: { email: '', phone: '', marketingOptIn: false },
      shipping: { fullName: '', address: '', city: '', state: '', zipCode: '', country: '' },
      payment: { cardNumber: '', cardName: '', expiryDate: '', cvv: '' }
    };
    setCheckoutData(empty);
    localStorage.removeItem('checkoutData');
  };

  return (
    <CheckoutContext.Provider
      value={{
        checkoutData,
        currentStep,
        updateCheckoutData,
        goToStep,
        clearCheckoutData
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
