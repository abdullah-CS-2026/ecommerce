import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  LogOut,
  ChevronLeft,
  Settings,
  PlusCircle,
  Menu,
  X
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Products', icon: <Package size={20} />, path: '/admin/products' },
    { name: 'Add Product', icon: <PlusCircle size={20} />, path: '/admin/products/new' },
    { name: 'Orders', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
    { name: 'Users', icon: <Users size={20} />, path: '/admin/users' },
  ];

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      {/* Backdrop - mobile/tablet only, shown while the drawer is open */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-slate-900 text-white flex flex-col fixed h-full shadow-2xl z-40 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white shadow-lg shrink-0">
              A
            </div>
            <span className="text-xl font-bold tracking-tight">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-grow py-6 px-4 space-y-2 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <span className="transition-transform duration-200 group-hover:scale-110">
                {link.icon}
              </span>
              <span className="font-medium">{link.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold border-2 border-slate-600 shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-red-500/10 hover:text-red-500 text-slate-400 transition-all duration-200 font-medium"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow lg:ml-64 p-4 sm:p-6 md:p-8 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6 sm:mb-10 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden shrink-0 bg-white p-2.5 rounded-lg shadow-sm border border-slate-200 text-slate-600 hover:text-primary transition-colors"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
              <div className="min-w-0">
                <Link to="/" className="text-sm text-slate-500 flex items-center hover:text-primary transition-colors mb-1 sm:mb-2">
                  <ChevronLeft size={16} className="mr-1 shrink-0" /> <span className="truncate">Back to Storefront</span>
                </Link>
                <h1 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight truncate">Admin Portal</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4 shrink-0">
              <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200 text-slate-500 hover:text-primary cursor-pointer transition-colors">
                <Settings size={20} />
              </div>
            </div>
          </div>

          <div className="animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;