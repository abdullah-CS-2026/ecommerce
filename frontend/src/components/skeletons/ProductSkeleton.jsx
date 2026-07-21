import Skeleton from "./Skeleton";

const ProductSkeleton = () => {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

            {/* Wishlist Button */}
            <div className="flex justify-end p-4 pb-0">
                <Skeleton className="h-12 w-12 rounded-full" />
            </div>

            {/* Product Image */}
            <div className="px-4">
                <Skeleton className="w-full aspect-[4/5] rounded-2xl" />
            </div>

            {/* Product Details */}
            <div className="p-6 space-y-4">

                {/* Category & Rating */}
                <div className="flex justify-between items-center">
                    <Skeleton className="h-3 w-20 rounded" />
                    <Skeleton className="h-3 w-12 rounded" />
                </div>

                {/* Product Name */}
                <Skeleton className="h-6 w-full rounded" />
                <Skeleton className="h-6 w-3/4 rounded" />

                {/* Price */}
                <Skeleton className="h-8 w-28 rounded" />

                {/* Stock */}
                <Skeleton className="h-3 w-24 rounded" />

                {/* Add to Cart Button */}
                <Skeleton className="h-12 w-full rounded-2xl" />

            </div>

        </div>
    );
};

export default ProductSkeleton;