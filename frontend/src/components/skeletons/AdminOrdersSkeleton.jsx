import Skeleton from "./Skeleton";
import { ShoppingBag } from "lucide-react";

const AdminOrdersSkeleton = () => {
  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-slate-300" size={24} />
            <Skeleton className="h-7 w-56 rounded" />
          </div>

          <Skeleton className="h-4 w-80 rounded" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

        {/* Table Head */}
        <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-5 border-b border-slate-100 bg-slate-50">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>

        {/* Desktop Rows */}
        <div className="hidden md:block">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-5 gap-4 px-6 py-5 border-b border-slate-100 items-center"
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>

              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-3 w-36 rounded" />
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-3 w-40 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
              </div>

              <Skeleton className="h-5 w-20 rounded" />

              <Skeleton className="h-7 w-20 rounded-full" />
            </div>
          ))}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-5 space-y-4">

              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>

                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />

                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-40 rounded" />
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-5/6 rounded" />
              </div>

              <div className="flex justify-between">
                <Skeleton className="h-3 w-12 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default AdminOrdersSkeleton;