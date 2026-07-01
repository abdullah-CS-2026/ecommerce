import {
    User, Mail, Phone, Camera, LogOut, Lock, MapPin, Package, Heart,
    Edit2, Trash2, Plus, Check, X, Eye, EyeOff
} from 'lucide-react';

export const SecurityTab = ({ passwordForm, setPasswordForm, showPassword, setShowPassword, loading, handleChangePassword }) => {

    return (
        <>

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

        </>
    )
}