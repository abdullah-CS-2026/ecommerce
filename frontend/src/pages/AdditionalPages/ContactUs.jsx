import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

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
               <p className="text-slate-400">Quainchi Metro Station, Lahore<br/></p>
             </div>
           </div>
           
           <div className="flex items-start">
             <Phone className="text-primary w-8 h-8 mr-4 shrink-0" />
             <div>
               <h3 className="font-semibold text-lg mb-1">Call Us</h3>
               <p className="text-slate-400">+923413348205<br/>Mon - Fri, 9am - 6pm EST</p>
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