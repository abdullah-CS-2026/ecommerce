import {
    User, Mail, Phone, Camera, LogOut, Lock, MapPin, Package, Heart,
    Edit2, Trash2, Plus, Check, X, Eye, EyeOff
} from 'lucide-react';

export const ProfileHeader = ({ profileData, formatDate, handleLogout }) => {

    return (
        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 text-center sm:text-left">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white shrink-0">
                        {profileData.profilePicture ? (
                            <img src={profileData.profilePicture} alt={profileData.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <User size={40} className="sm:w-12 sm:h-12" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 break-words">{profileData.name}</h1>
                        <p className="text-slate-600 mt-1 text-sm sm:text-base break-all">{profileData.email}</p>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 mt-3">
                            <span className="px-3 py-1 bg-blue-100 text-primary rounded-full text-xs sm:text-sm font-semibold capitalize">{profileData.role}</span>
                            <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${profileData.isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {profileData.isEmailVerified ? '✓ Verified' : '⚠ Unverified'}
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-100 transition-colors shrink-0 w-full sm:w-auto"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-4 pt-6 mt-6 sm:mt-0 border-t border-slate-200 text-center sm:text-left">
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

    )
}