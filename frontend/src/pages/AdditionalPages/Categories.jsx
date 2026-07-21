import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

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