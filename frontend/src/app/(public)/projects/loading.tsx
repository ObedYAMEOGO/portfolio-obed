export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">

        <div className="mb-20 space-y-4 border-b border-neutral-200 pb-12">
          <div className="h-3 w-40 animate-pulse bg-neutral-200" />
          <div className="h-14 w-2/3 animate-pulse bg-neutral-200" />
          <div className="h-6 w-1/2 animate-pulse bg-neutral-100" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-72 animate-pulse border border-neutral-200 bg-white"
            />
          ))}
        </div>

      </main>
    </div>
  );
}