import AddressForm from "../addresses/AddressForm";
import AddressCard from "../addresses/AddressCard";

export const AddressesTab = ({
    addresses,
    showAddressForm,
    setShowAddressForm,
    addressForm,
    setAddressForm,
    loading,
    handleAddAddress,
    handleDeleteAddress,
}) => {
    return (
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

        </div>
    );
};

