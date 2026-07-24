import React, { useState, useContext, useEffect } from 'react';
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import {
  Star,
  Truck,
  Shield,
  Plus,
  Minus,
  ChevronRight,
  Clock,
  CheckCircle,
  Tag,
  ShoppingCart,
  Heart
} from 'lucide-react';
import ProductDetailSkeleton from '../components/skeletons/ProductDetailSkeleton';

// TanStack Query fetch function by product id
const fetchProducts = async () => {
  try {
    setLoading(true);

    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products`
    );

    setProducts(res.data);
  } catch (err) {
    console.error(err);
    setError("Failed to fetch products");
  } finally {
    setLoading(false);
  }
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [selColor, setSelColor] = useState(null);
  const [selSize, setSelSize] = useState(null);

  const [addedToCart, setAddedToCart] = useState(false);

  // Query automatically:
  // ✅ fetches
  // ✅ caches
  // ✅ retries failed requests
  // ✅ prevents duplicate requests

  const {
    data: product,
    isLoading: loading,
    error
  } = useQuery({
    queryKey: ["product", id],

    // Pass current id to fetch function
    queryFn: () => fetchProduct(id),

    enabled: !!id,

    // Cache for 5 minutes
    staleTime: 1000 * 60 * 5,
  });

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (product?.mainImage) {
      setSelectedImage(product.mainImage);
    }
  }, [product]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error) return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-7 pt-9 pb-24">
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3.5 text-center">
          <p className="text-xl font-bold text-slate-900 mb-1.5">Product Not Found</p>
          <p className="text-sm text-slate-400 mb-5">{error?.message || 'This item may have been de-listed.'}</p>
          <Link
            to="/products"
            className="text-xs font-semibold text-primary uppercase tracking-wider border-b-[1.5px] border-current pb-0.5 hover:text-blue-700 transition-colors"
          >
            ← Back to Catalog
          </Link>
        </div>
      </div>
    </div>
  );

  const allImages = [product.mainImage, ...(product.images || [])].filter(Boolean);
  const inStock = product.countInStock > 0;

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-7 pt-9 pb-24">

        {/* Breadcrumb */}
        <nav className="animate-in fade-in duration-500 flex items-center gap-1.5 text-xs text-slate-400 mb-9">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={13} />
          <Link to="/products" className="hover:text-primary transition-colors">Catalog</Link>
          <ChevronRight size={13} />
          <span className="text-slate-900 font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-9 lg:gap-14 items-start">

          {/* Gallery */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-75">
            <div className="group relative bg-slate-200 rounded-2xl overflow-hidden aspect-square border border-slate-200 shadow-md">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover block transition-transform duration-700 ease-out group-hover:scale-105"
                onError={(e) => {
                  if (!e.target.dataset.errorHandled) {
                    e.target.dataset.errorHandled = 'true';
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect fill="%23eeebe5" width="600" height="600"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="18"%3EImage not available%3C/text%3E%3C/svg%3E';
                  }
                }}
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNewArrival && (
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-slate-900 text-white">
                    New
                  </span>
                )}
                {product.discountPercentage > 0 && (
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-green-600 text-white">
                    −{product.discountPercentage}%
                  </span>
                )}
              </div>
              <button
                className={`absolute top-4 right-4 w-9 h-9 sm:w-[38px] sm:h-[38px] rounded-full border border-slate-200 flex items-center justify-center cursor-pointer transition-all backdrop-blur-md hover:scale-105 ${
                  isInWishlist(product._id) ? 'bg-red-600/90 text-white' : 'bg-white/90 text-slate-600 hover:text-primary'
                }`}
                title="Wishlist"
                onClick={(e) => {
                  e.preventDefault();
                  if (isInWishlist(product._id)) {
                    removeFromWishlist(product._id);
                  } else {
                    addToWishlist(product._id);
                  }
                }}
              >
                <Heart size={16} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-2.5">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    className={`aspect-square rounded-[10px] overflow-hidden border-2 cursor-pointer transition-all bg-slate-100 ${
                      selectedImage === img
                        ? 'border-primary opacity-100 ring-[3px] ring-primary/15'
                        : 'border-transparent opacity-55 hover:opacity-85'
                    }`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img
                      src={img}
                      alt={`thumb-${i}`}
                      className="w-full h-full object-cover block"
                      onError={(e) => {
                        if (!e.target.dataset.errorHandled) {
                          e.target.dataset.errorHandled = 'true';
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23eeebe5" width="150" height="150"/%3E%3C/svg%3E';
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-6">

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-75 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded-full w-fit">
              <Tag size={11} />{product.category}
            </div>

            <h1 className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100 text-[28px] sm:text-4xl md:text-[40px] font-bold text-slate-900 leading-[1.12] tracking-tight">
              {product.name}
            </h1>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100 flex items-center gap-2.5 pb-5 border-b border-slate-200">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    fill={i < Math.floor(product.rating || 0) ? '#f59e0b' : 'none'}
                    color={i < Math.floor(product.rating || 0) ? '#f59e0b' : '#d1d5db'}
                  />
                ))}
              </div>
              <span className="text-[13px] text-slate-600">
                <b className="text-slate-900 font-semibold">{(product.rating || 0).toFixed(1)}</b> &nbsp;·&nbsp; {product.numReviews || 0} reviews
              </span>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150 bg-white border border-slate-200 rounded-[10px] p-5 shadow-sm">
              <div className="flex items-baseline gap-3 mb-2.5 flex-wrap">
                <span className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  {product.currency} {product.discountPrice?.toLocaleString()}
                </span>
                {product.originalPrice > product.discountPrice && (
                  <span className="text-base text-slate-400 line-through">
                    {product.currency} {product.originalPrice?.toLocaleString()}
                  </span>
                )}
              </div>
              <div className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                <span className={`w-[7px] h-[7px] rounded-full shrink-0 ${inStock ? 'bg-green-600' : 'bg-red-600'}`} />
                {inStock ? `${product.countInStock} in stock` : 'Pre-order available'}
              </div>
            </div>

            {(product.colors?.length > 0 || product.sizes?.length > 0) && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150 flex flex-col gap-[18px]">
                {product.colors?.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                      Color{selColor ? ` — ${selColor}` : ''}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c}
                          className={`px-4 py-1.5 border-[1.5px] rounded-lg text-xs font-medium cursor-pointer transition-all tracking-wide ${
                            selColor === c
                              ? 'border-primary text-primary bg-primary/5'
                              : 'border-slate-200 text-slate-600 bg-white hover:border-primary hover:text-primary'
                          }`}
                          onClick={() => setSelColor(selColor === c ? null : c)}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {product.sizes?.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                      Configuration{selSize ? ` — ${selSize}` : ''}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          className={`px-4 py-1.5 border-[1.5px] rounded-lg text-xs font-medium cursor-pointer transition-all tracking-wide ${
                            selSize === s
                              ? 'border-primary text-primary bg-primary/5'
                              : 'border-slate-200 text-slate-600 bg-white hover:border-primary hover:text-primary'
                          }`}
                          onClick={() => setSelSize(selSize === s ? null : s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="bg-white border border-slate-200 rounded-[10px] p-3.5 flex items-start gap-2.5">
                <Truck size={16} className="text-primary shrink-0 mt-px" />
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-[3px]">Shipping</div>
                  <div className="text-[13px] font-medium text-slate-900">
                    {product.shippingCost === 0 ? 'Free' : `${product.currency} ${product.shippingCost}`}
                  </div>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-[10px] p-3.5 flex items-start gap-2.5">
                <Clock size={16} className="text-primary shrink-0 mt-px" />
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-[3px]">Delivery</div>
                  <div className="text-[13px] font-medium text-slate-900">{product.deliveryTime}</div>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-[10px] p-3.5 flex items-start gap-2.5">
                <Shield size={16} className="text-primary shrink-0 mt-px" />
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-[3px]">Warranty</div>
                  <div className="text-[13px] font-medium text-slate-900">{product.warranty || '1 Year'}</div>
                </div>
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300 flex gap-2.5 items-stretch">
              <div className="flex items-center border-[1.5px] border-slate-200 rounded-[10px] overflow-hidden bg-white">
                <button
                  className="w-[42px] h-[52px] border-none bg-transparent cursor-pointer flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus size={16} />
                </button>
                <div className="w-10 text-center text-[15px] font-semibold text-slate-900 border-x border-slate-200 leading-[52px]">
                  {quantity}
                </div>
                <button
                  className="w-[42px] h-[52px] border-none bg-transparent cursor-pointer flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                className="flex-1 h-[52px] border-none rounded-[10px] bg-primary text-white cursor-pointer text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-[0_2px_8px_rgba(37,99,235,0.3)] hover:bg-blue-700 hover:shadow-[0_4px_16px_rgba(37,99,235,0.4)] hover:-translate-y-px active:scale-[0.98]"
                onClick={() => {
                  if (product) {
                    addToCart(product, quantity);
                    setAddedToCart(true);
                    setTimeout(() => setAddedToCart(false), 2000);
                  }
                }}
              >
                <ShoppingCart size={17} />
                {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
            </div>

          </div>
        </div>

        {/* Tabs */}
        <div className="animate-in fade-in duration-500 flex border-b-[1.5px] border-slate-200 mt-12 sm:mt-[60px] overflow-x-auto">
          <button
            className={`pt-3 pb-3 pr-7 bg-transparent border-none text-xs font-semibold uppercase tracking-wider cursor-pointer relative transition-colors whitespace-nowrap ${
              activeTab === 'specs' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
            onClick={() => setActiveTab('specs')}
          >
            Specifications
            {activeTab === 'specs' && (
              <span className="absolute -bottom-[1.5px] left-0 right-7 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            className={`pt-3 pb-3 pr-7 bg-transparent border-none text-xs font-semibold uppercase tracking-wider cursor-pointer relative transition-colors whitespace-nowrap ${
              activeTab === 'reviews' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({product.numReviews || 0})
            {activeTab === 'reviews' && (
              <span className="absolute -bottom-[1.5px] left-0 right-7 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {activeTab === 'specs' ? (
          <div className="animate-in fade-in duration-500 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8 md:gap-11 py-9 sm:py-11 items-start">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3.5 tracking-tight">Product Overview</h3>
              <p className="text-sm leading-7 text-slate-600">{product.description}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 sm:px-[22px] py-4 border-b border-slate-200 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Detailed Specifications
              </div>
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                Object.entries(product.specifications).map(([k, v]) => (
                  <div className="flex items-start px-5 sm:px-[22px] py-3.5 border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors" key={k}>
                    <span className="w-[42%] text-xs font-semibold text-slate-400 uppercase tracking-wide pt-px">{k}</span>
                    <span className="flex-1 text-[13px] font-medium text-slate-900">{v}</span>
                  </div>
                ))
              ) : (
                <div className="px-5 sm:px-[22px] py-6 text-[13px] text-slate-400">No specifications available.</div>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500 flex flex-col items-center justify-center py-16 sm:py-[72px] text-center">
            <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-amber-600 mb-5">
              <Star size={22} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Reviews Yet</h3>
            <p className="text-[13px] text-slate-400 max-w-xs">
              Verified purchases can leave reviews to help others make the right decision.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;