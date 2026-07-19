// Pure Server Component - 0 client JS overhead
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-800 ${className}`}
    />
  );
}

export default function Loading() {
  return (
    <div className="w-full bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero Section Skeleton matching exact page height and layout */}
      <section className="relative py-20 lg:py-32 overflow-hidden border-b dark:border-gray-800">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-8 text-right rtl:text-right ltr:text-left">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-12 md:h-16 w-11/12 rounded-2xl" />
              <Skeleton className="h-12 md:h-16 w-3/4 rounded-2xl" />
            </div>
            
            <div className="space-y-3">
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-4 w-5/6 rounded-lg" />
            </div>

            {/* Popular Categories tag row */}
            <div className="flex flex-wrap gap-2 pt-2 justify-start">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-start">
              <Skeleton className="h-12 w-full sm:w-40 rounded-xl" />
              <Skeleton className="h-12 w-full sm:w-40 rounded-xl" />
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-6 text-gray-400">
              <Skeleton className="h-5 w-28 rounded-lg" />
              <Skeleton className="h-5 w-28 rounded-lg" />
              <Skeleton className="h-5 w-28 rounded-lg" />
            </div>
          </div>

          {/* Hero Right Visual Column */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative aspect-[4/3] w-full max-w-lg mx-auto">
              <Skeleton className="absolute inset-0 rounded-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Above-the-fold Initial Statistics / Cards Placeholder */}
      <section className="py-12 border-b dark:border-gray-800">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 border border-gray-100 dark:border-gray-800 rounded-xl bg-card flex justify-between items-center space-x-4">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
