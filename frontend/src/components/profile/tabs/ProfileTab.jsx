import { Edit2, Check, X } from "lucide-react";
import { useState } from "react";
export const ProfileTab = ({
    profileData,
    editingProfile,
    setEditingProfile,
    profileForm,
    setProfileForm,
    loading,
    handleUpdateProfile
}) => {
    const [activeTab, setActiveTab] = useState('profile');

    return (

        <div>
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

        </div>

    );

};

export default ProfileTab;