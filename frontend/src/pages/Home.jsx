import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye, ArrowRight, Heart } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/products?isFeatured=true');
        const data = await res.json();
        setFeaturedProducts(data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover-lift group flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.mainImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.isNewArrival && <span className="absolute top-3 left-3 bg-blue-600 text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-tighter">New Arrival</span>}
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-tighter">
            {product.discountPercentage}% OFF
          </div>
        )}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 bg-white text-slate-900 p-2 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg hover:scale-110 z-10"
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center space-x-2 opacity-0 group-hover:opacity-100">
          <button className="bg-white text-slate-900 p-2 rounded-full hover:bg-primary hover:text-white transition-colors shadow-lg">
            <ShoppingCart size={18} />
          </button>
          <Link to={`/products/${product._id}`} className="bg-white text-slate-900 p-2 rounded-full hover:bg-primary hover:text-white transition-colors shadow-lg">
            <Eye size={18} />
          </Link>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs text-slate-500 mb-1 tracking-wide uppercase">{product.category}</div>
        <Link to={`/products/${product._id}`}>
          <h3 className="text-slate-900 font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center mb-3">
          <div className="flex text-accent space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "text-accent" : "text-slate-300"} />
            ))}
          </div>
          <span className="text-xs text-slate-500 ml-2">({product.numReviews || 0})</span>
        </div>

        <div className="mt-auto flex justify-between items-center">
          <div>
            <span className="text-lg font-bold text-slate-900">Rs. {product.discountPrice.toLocaleString()}</span>
            {product.originalPrice > product.discountPrice && (
              <span className="text-xs text-slate-400 line-through ml-2">Rs. {product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <button className="text-primary hover:text-white border border-primary hover:bg-primary px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=1920"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 md:py-32 lg:py-48 flex flex-col items-start">
          <span className="text-primary font-bold tracking-wider mb-2 uppercase text-sm animate-fade-in-up">New Arrivals 2026</span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 leading-tight max-w-2xl animate-fade-in-up animation-delay-100">
            Next-Gen Tech <br />For Your Lifestyle
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl leading-relaxed animate-fade-in-up animation-delay-200">
            Discover the latest in electronics, from state-of-the-art smartphones to immersive home entertainment systems.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up animation-delay-300">
            <Link to="/products" className="bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-md font-semibold transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center">
              Shop Now <ArrowRight size={20} className="ml-2" />
            </Link>
            <Link to="/categories" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-md font-semibold transition-all flex items-center justify-center">
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Featured Products</h2>
              <p className="text-slate-500 mt-2">Handpicked essentials for you</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center text-primary font-medium hover:text-blue-700 transition-colors">
              View All <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
               [...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-xl h-[400px] animate-pulse"></div>)
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map(product => <ProductCard key={product._id} product={product} />)
            ) : (
              <p className="col-span-full text-center text-slate-400 font-bold py-20">No featured products found.</p>
            )}
          </div>

          <div className="mt-10 sm:hidden text-center">
            <Link to="/products" className="inline-flex items-center text-primary font-medium hover:text-blue-700 border border-primary px-6 py-2 rounded-md">
              View All <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories/Banner section could go here */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">Why Shop With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
              <p className="text-slate-500 text-sm">On all orders over $50</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Support</h3>
              <p className="text-slate-500 text-sm">24/7 dedicated customer service</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
              <p className="text-slate-500 text-sm">100% secure payment processing</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
