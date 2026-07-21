import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";

import axios from 'axios';

import {
  User, Mail, Phone, Camera, LogOut, Lock, MapPin, Package, Heart,
  Edit2, Trash2, Plus, Check, X, Eye, EyeOff
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ProfileTabs } from '../components/profile/ProfileTabs';
import ProfileTab from '../components/profile/tabs/ProfileTab';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { SecurityTab } from '../components/profile/tabs/SecurityTab';
import { OrdersTab } from '../components/profile/tabs/OrdersTab';
import { WishlistTab } from '../components/profile/tabs/WishlistTab';
import { AddressForm } from '../components/profile/AddressesTab/AddressForm';
import { AddressCard } from '../components/profile/AddressesTab/AddressCard';
import ProfileSkeleton from '../components/skeletons/ProfileSkeleton';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
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

      const [profileRes, ordersRes, addressesRes] = await Promise.all([
        axios.get(`${baseUrl}/api/user/profile`),
        axios.get(`${baseUrl}/api/user/orders`),
        axios.get(`${baseUrl}/api/user/addresses`),
      ]);
      setProfileData(profileRes.data);
      setOrders(ordersRes.data);
      setAddresses(addressesRes.data);

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

      const response = await axios.put(`${baseUrl}/api/user/profile`, profileForm);
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

      await axios.post(`${baseUrl}/api/user/change-password`, {
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

      const response = await axios.post(`${baseUrl}/api/user/addresses`, addressForm);
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

      await axios.delete(`${baseUrl}/api/user/addresses/${addressId}`);
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
    return <ProfileSkeleton />;
}

  if (!profileData) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <X className="w-7 h-7 text-red-500" />
          </div>
          <p className="text-red-600 font-medium">Couldn't load your profile.</p>
          <p className="text-slate-500 text-sm mt-1">Please check your connection and try again.</p>
          <button
            onClick={fetchProfileData}
            className="mt-5 inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 lg:py-12">
        <ProfileHeader
          profileData={profileData}
          formatDate={formatDate}
          handleLogout={handleLogout}
        />

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-6 sm:mt-8">
          <div className="overflow-x-auto">
            <ProfileTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          <div key={activeTab} className="p-4 sm:p-6 md:p-8 animate-in fade-in duration-300">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <ProfileTab
                profileData={profileData}
                editingProfile={editingProfile}
                setEditingProfile={setEditingProfile}
                profileForm={profileForm}
                setProfileForm={setProfileForm}
                loading={loading}
                handleUpdateProfile={handleUpdateProfile}
              />
            )}

            {/* Security Tab */}
            {activeTab === "password" && (
              <SecurityTab
                passwordForm={passwordForm}
                setPasswordForm={setPasswordForm}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                loading={loading}
                handleChangePassword={handleChangePassword}
              />
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Saved Addresses</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Manage where your orders get delivered.</p>
                  </div>
                  {!showAddressForm && (
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Address
                    </button>
                  )}
                </div>

                {showAddressForm && (
                  <AddressForm
                    addressForm={addressForm}
                    setAddressForm={setAddressForm}
                    loading={loading}
                    handleAddAddress={handleAddAddress}
                    setShowAddressForm={setShowAddressForm}
                  />
                )}

                {addresses.length === 0 ? (
                  <div className="text-center py-12 sm:py-16">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-7 h-7 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-medium">No addresses saved yet</p>
                    <p className="text-slate-400 text-sm mt-1">Add one to speed up checkout next time.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <AddressCard
                        key={address._id}
                        address={address}
                        handleDeleteAddress={handleDeleteAddress}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <OrdersTab
                orders={orders}
                formatDate={formatDate}
              />
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <WishlistTab
                formatDate={formatDate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;