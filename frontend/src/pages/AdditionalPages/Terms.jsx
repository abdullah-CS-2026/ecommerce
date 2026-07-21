import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Terms = () => (
  <div className="container mx-auto px-4 py-16 max-w-4xl animate-fade-in-up">
    <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms and Conditions</h1>
    <div className="prose prose-slate max-w-none text-slate-700">
      <p className="mb-4">Last updated: March 2026</p>
      <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
      <p className="mb-4">By accessing and using ElectroMart, you accept and agree to be bound by the terms and provision of this agreement.</p>
      <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">2. Purchases and Payment</h2>
      <p className="mb-4">You agree to provide current, complete, and accurate purchase and account information for all purchases made via the site.</p>
      <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">3. Governing Law</h2>
      <p className="mb-4">These terms shall be governed by and construed in accordance with the laws of the State of California.</p>
    </div>
  </div>
);