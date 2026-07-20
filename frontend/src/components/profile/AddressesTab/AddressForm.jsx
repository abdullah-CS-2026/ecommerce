export const AddressForm = ({
    addressForm,
    setAddressForm,
    loading,
    handleAddAddress,
    setShowAddressForm,
}) => {

    return (<>

        <div className="bg-slate-50 p-4 sm:p-6 rounded-lg mb-6">
            <h3 className="font-black text-slate-900 mb-4">Add New Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Full Name"
                    aria-label="Full Name"
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    className="sm:col-span-2 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                    type="tel"
                    placeholder="Phone"
                    aria-label="Phone"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="sm:col-span-2 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                    type="email"
                    placeholder="Email"
                    aria-label="Email"
                    value={addressForm.email}
                    onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                    className="sm:col-span-2 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                    type="text"
                    placeholder="Street"
                    aria-label="Street"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    className="sm:col-span-2 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                    type="text"
                    placeholder="City"
                    aria-label="City"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                    type="text"
                    placeholder="State"
                    aria-label="State"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                    type="text"
                    placeholder="Postal Code"
                    aria-label="Postal Code"
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                    type="text"
                    placeholder="Country"
                    aria-label="Country"
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                    value={addressForm.addressType}
                    aria-label="Address Type"
                    onChange={(e) => setAddressForm({ ...addressForm, addressType: e.target.value })}
                    className="sm:col-span-2 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                    <option value="shipping">Shipping</option>
                    <option value="billing">Billing</option>
                    <option value="both">Both</option>
                </select>
                <label className="sm:col-span-2 flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold">Set as default</span>
                </label>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
                <button
                    onClick={handleAddAddress}
                    disabled={loading}
                    className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Address'}
                </button>
                <button
                    onClick={() => setShowAddressForm(false)}
                    className="flex-1 bg-slate-300 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-400 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>

    </>)
}