import Skeleton from "./Skeleton";

const ProductDetailSkeleton = () => {
    return (
        <div className="container mx-auto max-w-7xl px-6 py-10">

            {/* Breadcrumb */}
            <Skeleton className="h-4 w-72 rounded mb-8" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Left Side */}
                <div>

                    {/* Main Image */}
                    <Skeleton className="aspect-square w-full rounded-2xl" />

                    {/* Thumbnail Images */}
                    <div className="grid grid-cols-4 gap-3 mt-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="aspect-square rounded-xl"
                            />
                        ))}
                    </div>

                </div>

                {/* Right Side */}
                <div className="space-y-6">

                    {/* Category */}
                    <Skeleton className="h-5 w-28 rounded-full" />

                    {/* Product Name */}
                    <Skeleton className="h-10 w-full rounded" />
                    <Skeleton className="h-10 w-3/4 rounded" />

                    {/* Rating */}
                    <Skeleton className="h-5 w-40 rounded" />

                    {/* Price Card */}
                    <div className="border rounded-xl p-6 space-y-4">
                        <Skeleton className="h-10 w-40 rounded" />
                        <Skeleton className="h-4 w-32 rounded" />
                    </div>

                    {/* Variant Buttons */}
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-20 rounded" />

                        <div className="flex gap-2 flex-wrap">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <Skeleton
                                    key={index}
                                    className="h-10 w-20 rounded-lg"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Shipping Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="h-24 rounded-xl"
                            />
                        ))}
                    </div>

                    {/* Quantity + Button */}
                    <div className="flex gap-4">
                        <Skeleton className="h-14 w-36 rounded-xl" />
                        <Skeleton className="h-14 flex-1 rounded-xl" />
                    </div>

                </div>

            </div>

            {/* Tabs */}
            <div className="flex gap-6 mt-16">
                <Skeleton className="h-6 w-36 rounded" />
                <Skeleton className="h-6 w-28 rounded" />
            </div>

            {/* Description */}
            <div className="mt-10 space-y-4">
                <Skeleton className="h-8 w-60 rounded" />

                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
                <Skeleton className="h-4 w-4/6 rounded" />
            </div>

        </div>
    );
};

export default ProductDetailSkeleton;