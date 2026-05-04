import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingBag, 
  LogOut, 
  ChevronLeft,
  Settings,
  PlusCircle
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full shadow-2xl z-30">
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
            A
          </div>
          <span className="text-xl font-bold tracking-tight">Admin Panel</span>
        </div>

        <nav className="flex-grow py-6 px-4 space-y-2">
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
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold border-2 border-slate-600">
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
      <main className="flex-grow ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <Link to="/" className="text-sm text-slate-500 flex items-center hover:text-primary transition-colors mb-2">
                <ChevronLeft size={16} className="mr-1" /> Back to Storefront
              </Link>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
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

// Internal Link helper since we are missing it but using it
import { Link } from 'react-router-dom';

export default AdminDashboard;
