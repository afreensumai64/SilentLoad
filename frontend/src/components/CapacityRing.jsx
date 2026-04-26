const TOTAL_SLOTS = 5;

const CapacityRing = ({ capacity = 3 }) => {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const fill = (capacity / TOTAL_SLOTS) * circumference;

  return (
    <div className="relative flex items-center justify-center mb-7 w-[168px] h-[168px]">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(184,160,218,0.25)_0%,transparent_70%)] blur-xl" />
      <svg width="168" height="168" viewBox="0 0 168 168" className="absolute -rotate-90">
        <circle cx="84" cy="84" r={radius} stroke="#E2DAF0" strokeWidth="10" fill="none" />
        <circle
          cx="84" cy="84" r={radius}
          stroke="url(#grad)" strokeWidth="10" strokeLinecap="round" fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - fill}
        />
        <defs>
          <linearGradient id="grad">
            <stop offset="0%" stopColor="#C882B8" />
            <stop offset="60%" stopColor="#9868CC" />
            <stop offset="100%" stopColor="#7A50BC" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex flex-col items-center">
        <span className="text-5xl font-extrabold text-gray-900">{capacity}</span>
        <span className="text-xs text-gray-400 mt-1">tasks</span>
      </div>
    </div>
  );
};

export default CapacityRing;
