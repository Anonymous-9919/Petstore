export default function ProductLoading() {
  return (
    <div className="animate-pulse" style={{ minHeight: "100vh" }}>
      {/* Image placeholder */}
      <div className="bg-white w-full" style={{ height: 350 }}>
        <div className="w-full h-full bg-gray-200" />
      </div>

      {/* Name + price placeholder */}
      <div className="bg-white border-t border-b border-gray-200 px-3 py-4" style={{ minHeight: 45 }}>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="flex justify-between">
          <div className="h-5 bg-gray-200 rounded w-24" />
          <div className="h-8 bg-gray-200 rounded-full" style={{ width: 125 }} />
        </div>
      </div>

      {/* Description placeholder */}
      <div className="mx-3 mt-4">
        <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
        <div className="border bg-white p-3 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
          <div className="h-3 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
    </div>
  );
}
