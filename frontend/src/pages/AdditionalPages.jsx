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

export const ContactUs = () => (
  <div className="container mx-auto px-4 py-16 animate-fade-in-up">
    <h1 className="text-4xl font-bold text-slate-900 text-center mb-12">Contact Us</h1>
    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
      {/* Contact Form */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold mb-6 text-slate-900">Send us a message</h2>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
            <input type="text" className="w-full border border-slate-300 rounded-md px-4 py-3 focus:ring-primary focus:border-primary" placeholder="Your Name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input type="email" className="w-full border border-slate-300 rounded-md px-4 py-3 focus:ring-primary focus:border-primary" placeholder="Your Email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
            <textarea rows="4" className="w-full border border-slate-300 rounded-md px-4 py-3 focus:ring-primary focus:border-primary" placeholder="How can we help you?"></textarea>
          </div>
          <button type="button" className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors shadow-md flex items-center justify-center">
            <Send size={18} className="mr-2" /> Send Message
          </button>
        </form>
      </div>
      
      {/* Contact Details */}
      <div className="bg-slate-900 text-white p-8 rounded-xl shadow-lg flex flex-col justify-center">
         <h2 className="text-2xl font-bold mb-8 text-white">Get in touch</h2>
         <div className="space-y-8">
           <div className="flex items-start">
             <MapPin className="text-primary w-8 h-8 mr-4 shrink-0" />
             <div>
               <h3 className="font-semibold text-lg mb-1">Our Location</h3>
               <p className="text-slate-400">123 Tech Avenue, Silicon Valley<br/>CA 94025, United States</p>
             </div>
           </div>
           
           <div className="flex items-start">
             <Phone className="text-primary w-8 h-8 mr-4 shrink-0" />
             <div>
               <h3 className="font-semibold text-lg mb-1">Call Us</h3>
               <p className="text-slate-400">+1 (800) 123-4567<br/>Mon - Fri, 9am - 6pm EST</p>
             </div>
           </div>
           
           <div className="flex items-start">
             <Mail className="text-primary w-8 h-8 mr-4 shrink-0" />
             <div>
               <h3 className="font-semibold text-lg mb-1">Email</h3>
               <p className="text-slate-400">support@electromart.com<br/>sales@electromart.com</p>
             </div>
           </div>
         </div>
      </div>
    </div>
  </div>
);

export const Categories = () => {
  const cats = [
    { name: 'Audio', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400', desc: 'Headphones, Speakers & Soundbars' },
    { name: 'Home Entertainment', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', desc: 'TVs, Projectors & Consoles' },
    { name: 'Mobiles', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', desc: 'Smartphones & Tablets' },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400', desc: 'Cables, Chargers & Peripherals' },
    { name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', desc: 'MacBooks, UltraBooks & Gaming' },
    { name: 'Wearables', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', desc: 'Smartwatches & Fitness Trackers' },
  ];

  return (
    <div className="container mx-auto px-4 py-16 animate-fade-in-up">
      <h1 className="text-4xl font-bold text-slate-900 text-center mb-12">Shop by Category</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cats.map(c => (
          <Link to={`/products?category=${c.name}`} key={c.name} className="group relative rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-black aspect-video flex items-center justify-center">
            <img src={c.image} alt={c.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-105" />
            <div className="relative z-10 text-center p-6 transform group-hover:-translate-y-2 transition-transform duration-300">
              <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">{c.name}</h2>
              <p className="text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

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
