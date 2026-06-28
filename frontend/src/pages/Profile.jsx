import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { removeFromWishlistAsync } from "../redux/slices/wishlistSlice"


import axios from 'axios';
import {
  User, Mail, Phone, Camera, LogOut, Lock, MapPin, Package, Heart,
  Edit2, Trash2, Plus, Check, X, Eye, EyeOff
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#wishlist') {
      setActiveTab('wishlist');
    }
  }, [location.hash]);

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [wishlist, setWishlist] = useState(null);

  // Edit profile
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', profilePicture: '' });

  // Change password
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Address management
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '', phone: '', email: '', street: '', city: '', state: '', postalCode: '', country: '', isDefault: false, addressType: 'both'
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfileData();
  }, [user, navigate]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      const [profileRes, ordersRes, addressesRes, wishlistRes] = await Promise.all([
        axios.get('/api/user/profile'),
        axios.get('/api/user/orders'),
        axios.get('/api/user/addresses'),
        axios.get('/api/user/wishlist')
      ]);

      setProfileData(profileRes.data);
      setOrders(ordersRes.data);
      setAddresses(addressesRes.data);
      setWishlist(wishlistRes.data);

      setProfileForm({
        name: profileRes.data.name,
        phone: profileRes.data.phone || '',
        profilePicture: profileRes.data.profilePicture || ''
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);

      const response = await axios.put('/api/user/profile', profileForm);
      setProfileData(response.data.user);
      setEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      setLoading(true);

      await axios.post('/api/user/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully!');
    } catch (error) {
      alert('Error changing password: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      setLoading(true);

      const response = await axios.post('/api/user/addresses', addressForm);
      setAddresses([...addresses, response.data.address]);
      setShowAddressForm(false);
      setAddressForm({
        fullName: '', phone: '', email: '', street: '', city: '', state: '', postalCode: '', country: '', isDefault: false, addressType: 'both'
      });
      alert('Address added successfully!');
    } catch (error) {
      alert('Error adding address: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      setLoading(true);

      await axios.delete(`/api/user/addresses/${addressId}`);
      setAddresses(addresses.filter(a => a._id !== addressId));
      alert('Address deleted successfully!');
    } catch (error) {
      alert('Error deleting address: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading && !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading profile. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white">
                {profileData.profilePicture ? (
                  <img src={profileData.profilePicture} alt={profileData.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User size={48} />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900">{profileData.name}</h1>
                <p className="text-slate-600 mt-1">{profileData.email}</p>
                <div className="flex gap-4 mt-3">
                  <span className="px-3 py-1 bg-blue-100 text-primary rounded-full text-sm font-semibold capitalize">{profileData.role}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${profileData.isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {profileData.isEmailVerified ? '✓ Verified' : '⚠ Unverified'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-100 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
            <div>
              <p className="text-sm text-slate-600">Member Since</p>
              <p className="font-semibold text-slate-900">{formatDate(profileData.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Email Status</p>
              <p className="font-semibold text-slate-900">{profileData.isEmailVerified ? 'Verified' : 'Pending'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Account Type</p>
              <p className="font-semibold text-slate-900 capitalize">{profileData.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b border-slate-200">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'password', label: 'Security', icon: Lock },
              { id: 'addresses', label: 'Addresses', icon: MapPin },
              { id: 'orders', label: 'Orders', icon: Package },
              { id: 'wishlist', label: 'Wishlist', icon: Heart }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-black mb-6">Edit Profile</h2>

                {!editingProfile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-sm text-slate-600">Full Name</p>
                        <p className="font-semibold text-slate-900">{profileData.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-sm text-slate-600">Email Address</p>
                        <p className="font-semibold text-slate-900">{profileData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-sm text-slate-600">Phone Number</p>
                        <p className="font-semibold text-slate-900">{profileData.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingProfile(true)}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-6"
                    >
                      <Edit2 size={20} />
                      Edit Profile
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Profile Picture URL</label>
                      <input
                        type="text"
                        value={profileForm.profilePicture}
                        onChange={(e) => setProfileForm({ ...profileForm, profilePicture: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleUpdateProfile}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        <Check size={20} />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingProfile(false)}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-200 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
                      >
                        <X size={20} />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'password' && (
              <div>
                <h2 className="text-2xl font-black mb-6">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Confirm New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black">Saved Addresses</h2>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={20} />
                    Add Address
                  </button>
                </div>

                {showAddressForm && (
                  <div className="bg-slate-50 p-6 rounded-lg mb-6">
                    <h3 className="font-black text-slate-900 mb-4">Add New Address</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Full Name" value={addressForm.fullName} onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })} className="col-span-2 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                      <input type="tel" placeholder="Phone" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} className="col-span-2 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                      <input type="email" placeholder="Email" value={addressForm.email} onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })} className="col-span-2 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                      <input type="text" placeholder="Street" value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} className="col-span-2 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                      <input type="text" placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                      <input type="text" placeholder="State" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                      <input type="text" placeholder="Postal Code" value={addressForm.postalCode} onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })} className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                      <input type="text" placeholder="Country" value={addressForm.country} onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                      <select value={addressForm.addressType} onChange={(e) => setAddressForm({ ...addressForm, addressType: e.target.value })} className="col-span-2 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="shipping">Shipping</option>
                        <option value="billing">Billing</option>
                        <option value="both">Both</option>
                      </select>
                      <label className="col-span-2 flex items-center gap-2">
                        <input type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })} className="w-4 h-4" />
                        <span className="text-sm font-semibold">Set as default</span>
                      </label>
                    </div>
                    <div className="flex gap-4 mt-4">
                      <button onClick={handleAddAddress} disabled={loading} className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50">
                        Save Address
                      </button>
                      <button onClick={() => setShowAddressForm(false)} className="flex-1 bg-slate-300 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-400 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {addresses.length === 0 ? (
                  <p className="text-slate-600 text-center py-8">No addresses saved yet. Add one to get started!</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div key={address._id} className="border border-slate-300 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-slate-900">{address.fullName}</h3>
                            <p className="text-sm text-slate-600">{address.addressType.toUpperCase()}</p>
                          </div>
                          {address.isDefault && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Default</span>}
                        </div>
                        <p className="text-slate-600 text-sm">{address.street}</p>
                        <p className="text-slate-600 text-sm">{address.city}, {address.state} {address.postalCode}</p>
                        <p className="text-slate-600 text-sm">{address.country}</p>
                        <p className="text-slate-600 text-sm mt-2">{address.phone}</p>
                        <div className="flex gap-2 mt-4">
                          <button onClick={() => handleDeleteAddress(address._id)} className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-100 transition-colors">
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-black mb-6">Order History</h2>
                {orders.length === 0 ? (
                  <p className="text-slate-600 text-center py-8">No orders yet. Start shopping now!</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-slate-300 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-slate-900">Order #{order._id.slice(-8)}</h3>
                            <p className="text-sm text-slate-600">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-slate-900">Rs. {order.totalAmount.toLocaleString()}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                              }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item._id} className="flex justify-between text-sm text-slate-600">
                              <span>{item.name} × {item.quantity}</span>
                              <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-2xl font-black mb-6">My Wishlist</h2>
                {!wishlist || wishlist.products.length === 0 ? (
                  <p className="text-slate-600 text-center py-8">Your wishlist is empty. Add products you love!</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.products.map((item) => (
                      <div key={item._id} className="border border-slate-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="w-full bg-slate-200">
                          <img
                            src={item.productId.mainImage}
                            alt={item.productId.name}
                            className="w-full h-auto"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-slate-900 line-clamp-2">{item.productId.name}</h3>
                          <p className="text-lg font-bold text-primary mt-2">Rs. {item.productId.discountPrice.toLocaleString()}</p>
                          <p className="text-xs text-slate-600 mt-2">Added {formatDate(item.addedAt)}</p>
                        </div>
                        <button
                          onClick={() => dispatch(removeFromWishlistAsync(item.productId._id))}
                          className="mt-3 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                        >
                          Remove from Wishlist
                        </button>
                      </div>

                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
