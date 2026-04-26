const CapacityCard = ({ capacity, max }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-4">

      <div className="h-[3px] bg-gradient-to-r from-purple-300 via-pink-300 to-orange-300" />

      <div className="px-5 py-4">

        <div className="flex justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Today’s Capacity
          </span>

          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium">
            On Track
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl font-extrabold text-gray-900">
            {capacity}
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-700">tasks</p>
            <p className="text-xs text-gray-400">recommended today</p>
          </div>
        </div>

        <div className="flex gap-1 mb-2">
          {Array.from({ length: max }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded ${
                i < capacity
                  ? "bg-gradient-to-r from-pink-400 to-purple-500"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <p className="text-xs text-gray-400">
          {capacity} of {max} slots · within your limit
        </p>

      </div>
    </div>
  );
};

export default CapacityCard;