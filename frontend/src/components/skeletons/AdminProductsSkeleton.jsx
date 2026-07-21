import Skeleton from "./Skeleton";

const AdminProductsSkeleton = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100">
        <div className="space-y-3">
          <Skeleton className="h-8 w-64 rounded" />
          <Skeleton className="h-4 w-96 rounded" />
        </div>

        <Skeleton className="h-14 w-52 rounded-2xl" />
      </div>

      {/* Search */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between">
          <Skeleton className="h-14 w-full md:w-[450px] rounded-2xl" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>

        {/* Desktop */}
        <div className="hidden lg:block">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-6 px-8 py-6 border-b border-slate-100 items-center"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-2xl" />

                <div className="space-y-2">
                  <Skeleton className="h-5 w-48 rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                </div>
              </div>

              <div className="space-y-2 flex flex-col items-center">
                <Skeleton className="h-5 w-20 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>

              <div className="flex justify-center">
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>

              <div className="flex justify-center">
                <Skeleton className="h-4 w-16 rounded" />
              </div>

              <div className="flex justify-end gap-2">
                <Skeleton className="w-11 h-11 rounded-xl" />
                <Skeleton className="w-11 h-11 rounded-xl" />
                <Skeleton className="w-11 h-11 rounded-xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile */}
        <div className="lg:hidden divide-y divide-slate-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-5 space-y-4">
              <div className="flex gap-4">
                <Skeleton className="w-16 h-16 rounded-2xl" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-40 rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                </div>
              </div>

              <Skeleton className="h-5 w-24 rounded" />
              <Skeleton className="h-7 w-28 rounded-full" />

              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1 rounded-xl" />
                <Skeleton className="h-10 flex-1 rounded-xl" />
                <Skeleton className="h-10 flex-1 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProductsSkeleton;