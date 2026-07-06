import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { removeFromWishlistAsync } from "../redux/slices/wishlistSlice"

const baseUrl = import.meta.env.VITE_BACKEND_URL;

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

      // const [profileRes, ordersRes, addressesRes, wishlistRes] = await Promise.all([
      //   axios.get('/api/user/profile'),
      //   axios.get('/api/user/orders'),
      //   axios.get('/api/user/addresses'),
      //   axios.get('/api/user/wishlist')
      // ]);

      const [profileRes, ordersRes, addressesRes, wishlistRes] = await Promise.all([
  axios.get(`${baseUrl}/api/user/profile`),
  axios.get(`${baseUrl}/api/user/orders`),
  axios.get(`${baseUrl}/api/user/addresses`),
  axios.get(`${baseUrl}/api/user/wishlist`)
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
        <ProfileHeader
          profileData={profileData}
          formatDate={formatDate}
          handleLogout={handleLogout}
        />

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <ProfileTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <div className="p-8">
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
                  <p className="text-slate-600 text-center py-8">No addresses saved yet. Add one to get started!</p>
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
                wishlist={wishlist}
                dispatch={dispatch}
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
