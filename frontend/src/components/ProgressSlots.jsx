const ProgressSlots = ({ count = 0, max = 3 }) => {
  const remaining = max - count;
  return (
    <div className="mt-4">
      <div className="flex gap-2 mb-2">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded ${i < count ? "bg-gradient-to-r from-pink-400 to-purple-500" : "bg-gray-200"}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">
          {count === max ? "All tasks selected" : count === 0 ? "Tap to select tasks" : `${remaining} more to go`}
        </span>
        <span className="text-purple-500 font-semibold">{count} / {max}</span>
      </div>
    </div>
  );
};

export default ProgressSlots;
