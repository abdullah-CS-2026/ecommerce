import Skeleton from "./Skeleton";

const AdminFormSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Page Header */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-40 rounded" />
        <Skeleton className="h-10 w-80 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">

          {[1, 2, 3].map((section) => (
            <div
              key={section}
              className="bg-white rounded-3xl border border-slate-100 p-8"
            >
              <Skeleton className="h-8 w-48 rounded mb-6" />

              <div className="space-y-5">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl" />
              </div>
            </div>
          ))}

        </div>

        {/* Right Column */}
        <div className="space-y-8">

          {[1, 2, 3, 4].map((card) => (
            <div
              key={card}
              className="bg-white rounded-3xl border border-slate-100 p-8"
            >
              <Skeleton className="h-7 w-40 rounded mb-6" />

              <div className="space-y-4">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default AdminFormSkeleton;