import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingBag, Loader2, AlertCircle, Package, User } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`);
      setOrders(res.data);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-amber-100 text-amber-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center">
            <ShoppingBag className="mr-3 text-primary shrink-0" size={24} />
            Customer Orders
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Review all customer purchases and order status at a glance.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      {loading ? (
    <AdminOrdersSkeleton />
): error ? (
          <div className="p-12 sm:p-32 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500">
              <AlertCircle size={36} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">Unable to load orders</h3>
              <p className="text-slate-500 mt-2 text-sm sm:text-base">{error}</p>
            </div>
            <button onClick={fetchOrders} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">Retry</button>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 sm:p-32 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">🛍️</div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">No orders yet</h3>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">Customer orders will appear here once purchases are made.</p>
          </div>
        ) : (
          <>
            {/* Desktop / tablet table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.15em] font-black border-b border-slate-100">
                    <th className="px-6 py-5">Order</th>
                    <th className="px-6 py-5">Customer</th>
                    <th className="px-6 py-5">Items</th>
                    <th className="px-6 py-5">Total</th>
                    <th className="px-6 py-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-primary/[0.02] transition-colors">
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-bold text-slate-900">#{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                            <User size={16} className="text-slate-500" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{order.userId?.name || 'Unknown'}</p>
                            <p className="text-sm text-slate-500">{order.userId?.email || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-2">
                          {order.items?.slice(0, 3).map((item, index) => (
                            <div key={`${order._id}-${index}`} className="flex items-center space-x-2 text-sm text-slate-600">
                              <Package size={14} className="text-primary" />
                              <span>{item.name} × {item.quantity}</span>
                            </div>
                          ))}
                          {order.items?.length > 3 && <p className="text-xs text-slate-400">+{order.items.length - 3} more</p>}
                        </div>
                      </td>
                      <td className="px-6 py-5 font-bold text-slate-900">Rs. {order.totalAmount?.toLocaleString()}</td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${getStatusStyles(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list - same data, stacked layout instead of a scrolling table */}
            <div className="md:hidden divide-y divide-slate-100">
              {orders.map((order) => (
                <div key={order._id} className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize shrink-0 ${getStatusStyles(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <User size={14} className="text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">{order.userId?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500 truncate">{order.userId?.email || '-'}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-slate-50 rounded-xl p-3">
                    {order.items?.slice(0, 3).map((item, index) => (
                      <div key={`${order._id}-${index}`} className="flex items-center space-x-2 text-sm text-slate-600">
                        <Package size={14} className="text-primary shrink-0" />
                        <span className="truncate">{item.name} × {item.quantity}</span>
                      </div>
                    ))}
                    {order.items?.length > 3 && <p className="text-xs text-slate-400">+{order.items.length - 3} more</p>}
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs text-slate-500 font-medium">Total</span>
                    <span className="font-bold text-slate-900">Rs. {order.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;