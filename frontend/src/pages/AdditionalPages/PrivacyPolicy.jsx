import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const PrivacyPolicy = () => (
  <div className="container mx-auto px-4 py-16 max-w-4xl animate-fade-in-up">
    <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
    <div className="prose prose-slate max-w-none text-slate-700">
      <p className="mb-4">Last updated: March 2026</p>
      <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>
      <p className="mb-4">We collect information you provide directly to us when you create an account, make a purchase, or communicate with us.</p>
      <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">2. Use of Information</h2>
      <p className="mb-4">We use the information we collect to provide, maintain, and improve our services, communicate with you, and personalize your experience.</p>
      <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">3. Data Security</h2>
      <p className="mb-4">We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.</p>
    </div>
  </div>
);
