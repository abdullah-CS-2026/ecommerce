import React, { useState, useEffect, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye, ArrowRight, Heart, Truck, ShieldCheck, Headphones, Sparkles } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';

const Home = () => {


  const fetchProducts = async () => {
    console.log(import.meta.env.VITE_BACKEND_URL);
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`);

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    return res.json();
  };

  const {
    data = [],
    isLoading: loading,
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const featuredProducts =
    data.filter(product => product.isFeatured).length > 0
      ? data.filter(product => product.isFeatured).slice(0, 4)
      : data.slice(0, 4);



  const ProductCard = ({ product }) => {
    const { isInWishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
    const inWishlist = isInWishlist(product._id);

    const handleWishlist = async (e) => {
      e.preventDefault();
      if (inWishlist) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product._id);
      }
    };

    console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);

    return (
      <div className="relative bg-white rounded-2xl border border-slate-200/70 overflow-hidden flex flex-col h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_-15px_rgba(15,23,42,0.25)] group">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            {product.isNewArrival && (
              <span className="bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                New
              </span>
            )}
            {product.discountPercentage > 0 && (
              <span className="bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                -{product.discountPercentage}%
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-4 right-4 bg-white/95 backdrop-blur text-slate-700 p-2.5 rounded-full hover:bg-rose-500 hover:text-white transition-all shadow-md hover:scale-110 z-10"
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>

          {/* Quick actions */}
          <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button className="bg-white/95 backdrop-blur text-slate-900 p-2.5 rounded-full hover:bg-blue-600 hover:text-white transition-colors shadow-lg">
              <ShoppingCart size={16} />
            </button>
            <Link
              to={`/products/${product._id}`}
              className="bg-white/95 backdrop-blur text-slate-900 p-2.5 rounded-full hover:bg-blue-600 hover:text-white transition-colors shadow-lg"
            >
              <Eye size={16} />
            </Link>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="text-[11px] text-slate-400 mb-1.5 tracking-[0.15em] uppercase font-medium">
            {product.category}
          </div>
          <Link to={`/products/${product._id}`}>
            <h3 className="text-slate-900 font-semibold text-[15px] leading-snug mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center mb-4">
            <div className="flex text-amber-400 space-x-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                  className={i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-200'}
                />
              ))}
            </div>
            <span className="text-xs text-slate-400 ml-2">({product.numReviews || 0})</span>
          </div>

          <div className="mt-auto flex justify-between items-end pt-3 border-t border-slate-100">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 leading-none">
                Rs. {product.discountPrice.toLocaleString()}
              </span>
              {product.originalPrice > product.discountPrice && (
                <span className="text-xs text-slate-400 line-through mt-1">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <button className="bg-slate-900 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-blue-600/30">
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=1920"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.25),transparent_50%)]" />
        </div>

        {/* Decorative orbs */}
        <div className="absolute top-1/4 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-28 md:py-36 lg:py-52 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full mb-6 animate-fade-in-up">
            <Sparkles size={14} className="text-blue-400" />
            <span className="text-xs font-medium tracking-wider uppercase text-slate-200">New Arrivals 2026</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-8xl font-extrabold mb-6 leading-[1.05] tracking-tight max-w-3xl animate-fade-in-up animation-delay-100">
            Next-Gen Tech
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              For Your Lifestyle
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300/90 mb-10 max-w-xl leading-relaxed animate-fade-in-up animation-delay-200">
            Discover the latest in electronics — from state-of-the-art smartphones to immersive home entertainment systems.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-300">
            <Link
              to="/products"
              className="group bg-white text-slate-900 px-8 py-4 rounded-full font-semibold transition-all hover:shadow-2xl hover:shadow-white/20 flex items-center justify-center gap-2"
            >
              Shop Now
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/categories"
              className="bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/15 px-8 py-4 rounded-full font-semibold transition-all flex items-center justify-center"
            >
              Browse Categories
            </Link>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg animate-fade-in-up animation-delay-300">
            {[
              { n: '50K+', l: 'Happy Customers' },
              { n: '1.2K+', l: 'Products' },
              { n: '4.9★', l: 'Avg. Rating' },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl md:text-3xl font-bold text-white">{s.n}</div>
                <div className="text-xs text-slate-400 mt-1 tracking-wide">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-12 gap-4">
            <div>
              <div className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase mb-3">
                — Curated Selection
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                Featured Products
              </h2>
              <p className="text-slate-500 mt-3 text-lg">Handpicked essentials, made for you.</p>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-2 text-slate-900 font-semibold hover:text-blue-600 transition-colors group"
            >
              View All
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-[440px] border border-slate-100 overflow-hidden"
                >
                  <div className="aspect-square bg-slate-100 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-1/3" />
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-slate-400 font-medium py-20">
                No featured products found.
              </p>
            )}
          </div>

          <div className="mt-12 sm:hidden text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold px-6 py-3 rounded-full"
            >
              View All <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY SHOP */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_60%)]" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase mb-3">
              — Why Choose Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Built on trust, delivered with care
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'Complimentary delivery on all orders over $50, anywhere in the country.' },
              { icon: Headphones, title: 'Premium Support', desc: '24/7 dedicated customer service from real humans who care.' },
              { icon: ShieldCheck, title: 'Secure Payments', desc: '100% encrypted checkout with all major payment methods supported.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-blue-500/30 transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-xl mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
