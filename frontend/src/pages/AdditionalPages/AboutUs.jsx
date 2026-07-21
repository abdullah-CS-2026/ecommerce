import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const AboutUs = () => (
  <div className="container mx-auto px-4 py-16 animate-fade-in-up">
    <div className="max-w-3xl mx-auto text-center mb-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">About ElectroMart</h1>
      <p className="text-lg text-slate-600 leading-relaxed">
        Founded in 2026, ElectroMart has grown to become the premier destination for cutting-edge electronics and accessories. 
        We believe that technology should be accessible, reliable, and enhancing to your everyday life.
      </p>
    </div>
    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
      <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800" alt="Our Team" className="rounded-xl shadow-lg" />
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Mission</h2>
        <p className="text-slate-600 mb-6 leading-relaxed">
          To empower our customers by providing the latest electronics with exceptional customer service and competitive pricing. 
          We meticulously source our products from trusted manufacturers globally to ensure you receive the highest quality tech.
        </p>
        <ul className="space-y-4">
          <li className="flex items-center text-slate-700">
            <span className="w-2 h-2 bg-primary rounded-full mr-3"></span> Quality Assurance Guaranteed
          </li>
          <li className="flex items-center text-slate-700">
             <span className="w-2 h-2 bg-primary rounded-full mr-3"></span> 24/7 Dedicated Support
          </li>
          <li className="flex items-center text-slate-700">
             <span className="w-2 h-2 bg-primary rounded-full mr-3"></span> Sustainable Sourcing Practices
          </li>
        </ul>
      </div>
    </div>
  </div>
);
