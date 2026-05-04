import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ChevronDown, Star, ShoppingCart, Percent, Heart } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';

const ProductList = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Wishlist context
  const { isInWishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(1000000); // PKR scale - increased to accommodate all products
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState('newest');

  const categories = ['All', 'Mobiles', 'Laptops', 'TV', 'Audio', 'Wearables', 'Accessories'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to load professional inventory.');
        const data = await res.json();
        setAllProducts(data);
        setProducts(data);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...allProducts];

    if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (category !== 'All') filtered = filtered.filter(p => p.category === category);
    filtered = filtered.filter(p => p.discountPrice <= priceRange);
    if (rating > 0) filtered = filtered.filter(p => p.rating >= rating);

    if (sort === 'priceLowToHigh') filtered.sort((a, b) => a.discountPrice - b.discountPrice);
    else if (sort === 'priceHighToLow') filtered.sort((a, b) => b.discountPrice - a.discountPrice);
    else if (sort === 'popularity') filtered.sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0));

    setProducts(filtered);
  }, [search, category, priceRange, rating, sort, allProducts]);

  if (fetchError) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center items-center min-h-[60vh]">
        <div className="text-center group">
          <div className="text-6xl mb-6 group-hover:rotate-12 transition-transform duration-300">🏪</div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Sync Error</h2>
          <p className="text-slate-500 font-medium mb-8">{fetchError}</p>
          <button onClick={() => window.location.reload()} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all">Retry Sync</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">Professional <span className="text-primary">Catalog</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Browse our premium selection of technology and accessories.</p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex-grow md:flex-none">
            <select
              className="w-full border-none bg-white rounded-2xl px-6 py-4 text-sm font-bold shadow-sm focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer outline-none"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Latest Collections</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="popularity">Most Popular</option>
            </select>
          </div>
          <button
            className="md:hidden flex items-center space-x-2 bg-white rounded-2xl px-6 py-4 text-sm font-bold shadow-sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar Filters */}
        <div className={`md:w-80 flex-shrink-0 ${isSidebarOpen ? 'fixed inset-0 z-50 bg-white p-8' : 'hidden md:block'}`}>
          <div className="sticky top-28 space-y-8">
            <div className="flex items-center justify-between md:hidden mb-10">
              <h2 className="text-2xl font-black">Filters</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={24} /></button>
            </div>

            {/* Price Filter with PKR Scale */}
            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-inner">
              <label className="block text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Price Capability</label>
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                <span>Rs. 0</span>
                <span>Rs. {priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000000"
                step="1000"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              />
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Marketplaces</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <button
                    key={c}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${category === c ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-100'}`}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* rating */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Trust Index</label>
              <div className="space-y-2">
                {[4, 3, 2].map(r => (
                  <button
                    key={r}
                    onClick={() => setRating(r)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all border ${rating === r ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                  >
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < r ? "#fbbf24" : "none"} className={i < r ? "text-amber-400" : "text-slate-200"} />
                      ))}
                      <span className="text-xs font-bold text-slate-500 ml-2">& Up</span>
                    </div>
                    {rating === r && <div className="w-2 h-2 rounded-full bg-amber-400"></div>}
                  </button>
                ))}
                <button 
                  onClick={() => setRating(0)}
                  className={`w-full text-center py-2 text-xs font-bold tracking-widest uppercase transition-colors ${rating === 0 ? 'text-primary' : 'text-slate-400'}`}
                >
                  Reset Rating
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl h-[400px] animate-pulse-slow shadow-sm border border-slate-50"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-20 text-center">
              <div className="text-8xl mb-6">📉</div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Inventory Gap</h3>
              <p className="text-slate-500 font-medium">We couldn't find any products matching those parameters.</p>
              <button
                className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl"
                onClick={() => { setSearch(''); setCategory('All'); setPriceRange(1000000); setRating(0); }}
              >
                Reset Database Query
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
                <div key={product._id} className="group bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full relative">
                  
                  {/* Overlay Badges */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {product.isNewArrival && <span className="bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">New Arrival</span>}
                    {product.discountPercentage > 0 && (
                      <span className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg flex items-center">
                        <Tag size={10} className="mr-1" /> {product.discountPercentage}% Off
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (isInWishlist(product._id)) {
                        removeFromWishlist(product._id);
                      } else {
                        addToWishlist(product._id);
                      }
                    }}
                    className="absolute top-4 right-4 z-10 bg-white text-slate-900 p-3 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg hover:scale-110"
                    title={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart size={18} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
                  </button>

                  {/* Image */}
                  <Link to={`/products/${product._id}`} className="block aspect-[4/5] overflow-hidden bg-slate-50 relative">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Link>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{product.category}</span>
                      <div className="flex items-center space-x-1">
                        <Star size={10} fill="#fbbf24" className="text-amber-400" />
                        <span className="text-[10px] font-bold text-slate-500">{product.rating ? product.rating.toFixed(1) : 'New'}</span>
                      </div>
                    </div>

                    <Link to={`/products/${product._id}`}>
                      <h3 className="text-slate-900 font-bold mb-3 line-clamp-2 hover:text-primary transition-colors text-lg tracking-tight leading-snug">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                      <div>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-xl font-black text-slate-900 tracking-tighter">Rs. {product.discountPrice.toLocaleString()}</span>
                          {product.originalPrice > product.discountPrice && (
                            <span className="text-xs text-slate-400 line-through font-bold">Rs. {product.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                        <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-1">Available Stock</p>
                      </div>
                      <button className="w-12 h-12 flex items-center justify-center bg-slate-900 text-white rounded-2xl hover:bg-primary transition-all shadow-lg hover:shadow-primary/30 group/btn">
                        <ShoppingCart size={20} className="group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Simple internal helper
const X = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;

export default ProductList;
