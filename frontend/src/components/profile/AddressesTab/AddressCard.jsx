export const AddressCard = ({
    address,
    handleDeleteAddress,
}) => {
    return (
        <>
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
        </>
    )
}