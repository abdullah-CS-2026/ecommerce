import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Edit,
  Trash2,
  Plus,
  Search,
  MoreVertical,
  ExternalLink,
  Loader2,
  AlertCircle,
  Tag,
  Star,
  Package
} from 'lucide-react';
import AdminProductsSkeleton from '../../components/skeletons/AdminProductsSkeleton';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {

      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products?page=${page}`);
      console.log(res.data);
     setProducts(res.data.products);
setTotalPages(res.data.totalPages);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center">
            <Package className="mr-3 text-primary shrink-0" size={24} />
            Professional Inventory
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Manage your products, pricing, and stock status across the platform.</p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center justify-center space-x-2 bg-primary hover:bg-blue-700 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl transition-all shadow-xl shadow-primary/20 font-bold w-full md:w-auto"
        >
          <Plus size={20} />
          <span>Post New Product</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Table Controls */}
        <div className="p-5 sm:p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 bg-slate-50/30">
          <div className="relative w-full md:w-[450px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, brand, or category..."
              className="w-full pl-12 pr-6 py-3.5 sm:py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-slate-100 text-slate-500 rounded-full text-xs font-black uppercase tracking-widest">
              Live Stock: {products.length}
            </div>
          </div>
        </div>

        {loading ? (

          <AdminProductsSkeleton />
        )
          : filteredProducts.length === 0 ? (
            <div className="p-12 sm:p-32 text-center flex flex-col items-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">📦</div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">Inventory Empty</h3>
              <p className="text-slate-500 mt-2 text-sm sm:text-base">No products match your current search parameters.</p>
            </div>
          ) : (
            <>
              {/* Desktop / tablet table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.15em] font-black border-b border-slate-100">
                      <th className="px-8 py-6">Product Information</th>
                      <th className="px-8 py-6 text-center">Pricing (PKR)</th>
                      <th className="px-8 py-6 text-center">Inventory</th>
                      <th className="px-8 py-6 text-center">Status</th>
                      <th className="px-8 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-primary/[0.02] transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-300">
                              <img
                                src={product.mainImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                              />
                            </div>
                            <div>
                              <p className="text-base font-extrabold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                                {product.name}
                              </p>
                              <div className="flex items-center space-x-3 mt-1.5">
                                <span className="flex items-center scale-90 origin-left">
                                  <Tag size={12} className="text-primary mr-1" />
                                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{product.category}</span>
                                </span>
                                {product.brand && (
                                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                )}
                                {product.brand && (
                                  <span className="text-[10px] text-primary/60 font-black uppercase tracking-tighter">
                                    {product.brand}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center text-sm">
                          <div className="flex flex-col items-center">
                            <span className="font-black text-slate-900 tracking-tight">Rs. {product.discountPrice.toLocaleString()}</span>
                            {product.originalPrice > product.discountPrice && (
                              <div className="flex items-center space-x-2 mt-0.5">
                                <span className="text-[10px] text-slate-400 line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                                <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-lg font-black">-{product.discountPercentage}%</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="flex flex-col items-center space-y-1">
                            <span className={`text-[10px] font-black px-3 py-1.5 rounded-full ${product.countInStock > 10
                              ? 'bg-emerald-50 text-emerald-600'
                              : product.countInStock > 0
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-red-50 text-red-600'
                              }`}>
                              {product.countInStock > 0 ? `${product.countInStock} Units` : 'Sold Out'}
                            </span>
                            <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${product.countInStock > 10 ? 'bg-emerald-400' : product.countInStock > 0 ? 'bg-amber-400' : 'bg-red-400'}`}
                                style={{ width: `${Math.min(100, product.countInStock * 2)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="flex fslex-col items-center space-y-1.5">
                            <div className="flex items-center scale-75 text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} />
                              ))}
                            </div>
                            <div className="flex flex-wrap justify-center gap-2">
                              {product.isFeatured && (
                                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-semibold">
                                  Featured
                                </span>
                              )}

                              {product.isNewArrival && (
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
                                  New Arrival
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              to={`/products/${product._id}`}
                              target="_blank"
                              className="p-3 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-all shadow-sm"
                              title="View on site"
                            >
                              <ExternalLink size={20} />
                            </Link>
                            <Link
                              to={`/admin/products/edit/${product._id}`}
                              className="p-3 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-all shadow-sm"
                              title="Edit"
                            >
                              <Edit size={20} />
                            </Link>
                            <button
                              onClick={() => deleteHandler(product._id)}
                              className="p-3 text-slate-400 hover:text-white hover:bg-red-600 rounded-xl transition-all shadow-sm"
                              title="Delete"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile / tablet card list - same data + same handlers, stacked layout */}
              <div className="lg:hidden divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="p-5 space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
                        <img
                          src={product.mainImage}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-extrabold text-slate-900 line-clamp-2">{product.name}</p>
                        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1.5">
                          <span className="flex items-center">
                            <Tag size={12} className="text-primary mr-1" />
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{product.category}</span>
                          </span>
                          {product.brand && (
                            <span className="text-[10px] text-primary/60 font-black uppercase tracking-tighter">{product.brand}</span>
                          )}
                        </div>
                        <div className="flex items-center scale-75 origin-left text-amber-400 -ml-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <span className="font-black text-slate-900 tracking-tight text-sm">Rs. {product.discountPrice.toLocaleString()}</span>
                        {product.originalPrice > product.discountPrice && (
                          <span className="ml-2 text-[10px] text-slate-400 line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-full ${product.countInStock > 10
                        ? 'bg-emerald-50 text-emerald-600'
                        : product.countInStock > 0
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-red-50 text-red-600'
                        }`}>
                        {product.countInStock > 0 ? `${product.countInStock} Units` : 'Sold Out'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {product.isFeatured && (
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-600">Featured</span>
                      )}
                      {product.isNewArrival && (
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-50 text-green-600">New</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <Link
                        to={`/products/${product._id}`}
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm text-slate-600 hover:text-white hover:bg-slate-900 rounded-xl transition-all border border-slate-200"
                      >
                        <ExternalLink size={16} /> View
                      </Link>
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm text-slate-600 hover:text-white hover:bg-slate-900 rounded-xl transition-all border border-slate-200"
                      >
                        <Edit size={16} /> Edit
                      </Link>
                      <button
                        onClick={() => deleteHandler(product._id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm text-red-600 hover:text-white hover:bg-red-600 rounded-xl transition-all border border-red-100"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                ))}


              </div>

              <div className="flex justify-center items-center gap-2 py-6">
                <button
                  onClick={() => setPage(prev=>prev - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Previous
                </button>

                <span>
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage(prev=>prev + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>

            </>
          )}
      </div>
    </div>
  );
};

export default AdminProducts;