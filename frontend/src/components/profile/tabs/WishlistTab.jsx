import {
    User, Mail, Phone, Camera, LogOut, Lock, MapPin, Package, Heart,
    Edit2, Trash2, Plus, Check, X, Eye, EyeOff
} from 'lucide-react';

export const WishlistTab = ({ wishlist,
    dispatch,
    formatDate }) => {
    return (<>
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
    </>)
}