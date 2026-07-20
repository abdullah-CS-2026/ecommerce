import React, { useState, useEffect } from "react";
const baseUrl = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import { useDispatch } from "react-redux";

import { removeFromWishlistAsync } from '../../../redux/slices/wishlistSlice';

export const WishlistTab = ({ formatDate }) => {

    const dispatch = useDispatch();
    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const response = await axios.get(
                `${baseUrl}/api/user/wishlist`
            );

            setWishlist(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {

        const result = await dispatch(
            removeFromWishlistAsync(productId)
        );

        if (removeFromWishlistAsync.fulfilled.match(result)) {
            fetchWishlist();
        }
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-3 text-sm text-slate-600">Loading wishlist...</p>
            </div>
        );
    }

    return (<>
        <div>
            <h2 className="text-xl sm:text-2xl font-black mb-6">My Wishlist</h2>
            {!wishlist || wishlist.products.length === 0 ? (
                <p className="text-slate-600 text-center py-8">Your wishlist is empty. Add products you love!</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.products.map((item) => (
                        <div key={item._id} className="border border-slate-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                            <div className="w-full aspect-square bg-slate-200 overflow-hidden">
                                <img
                                    src={item.productId.mainImage}
                                    alt={item.productId.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="font-semibold text-slate-900 line-clamp-2">{item.productId.name}</h3>
                                <p className="text-lg font-bold text-primary mt-2">Rs. {item.productId.discountPrice.toLocaleString()}</p>
                                <p className="text-xs text-slate-600 mt-2">Added {formatDate(item.addedAt)}</p>
                                <button
                                    onClick={() => handleRemove(item.productId._id)}
                                    className="mt-3 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors text-sm font-semibold"
                                >
                                    Remove from Wishlist
                                </button>
                            </div>
                        </div>

                    ))}
                </div>
            )}
        </div>
    </>)
}