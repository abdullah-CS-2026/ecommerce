import Skeleton from "./Skeleton";

const ProfileSkeleton = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 lg:py-12">

                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <div className="flex flex-col md:flex-row md:items-center gap-6">

                        {/* Avatar */}
                        <Skeleton className="h-24 w-24 rounded-full" />

                        {/* User Info */}
                        <div className="flex-1 space-y-3">

                            <Skeleton className="h-8 w-56 rounded" />

                            <Skeleton className="h-5 w-72 rounded" />

                            <Skeleton className="h-5 w-48 rounded" />

                        </div>

                        {/* Logout Button */}
                        <Skeleton className="h-11 w-32 rounded-lg" />

                    </div>

                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-lg mt-8">

                    <div className="border-b p-5 flex gap-6">

                        <Skeleton className="h-6 w-24 rounded" />

                        <Skeleton className="h-6 w-24 rounded" />

                        <Skeleton className="h-6 w-24 rounded" />

                        <Skeleton className="h-6 w-24 rounded" />

                    </div>

                    {/* Profile Form */}
                    <div className="p-8 space-y-6">

                        <Skeleton className="h-12 w-full rounded-lg" />

                        <Skeleton className="h-12 w-full rounded-lg" />

                        <Skeleton className="h-12 w-full rounded-lg" />

                        <Skeleton className="h-40 w-full rounded-xl" />

                        <div className="flex justify-end">

                            <Skeleton className="h-11 w-36 rounded-lg" />

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default ProfileSkeleton;