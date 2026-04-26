import { Check } from "lucide-react";

const AreaCard = ({ area, isSelected, onToggle }) => {
  const Icon = area.Icon;

  return (
    <button
      onClick={onToggle}
      className={`relative flex flex-col text-left rounded-2xl p-4 min-h-[130px] transition ${
        isSelected
          ? `${area.bg} border ${area.border} shadow-md`
          : "bg-white border border-gray-200"
      }`}
    >
      {/* Top */}
      <div className="flex justify-between items-start">

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isSelected ? area.iconBg : "bg-gray-100"
          }`}
        >
          <Icon
            size={18}
            className={isSelected ? "text-white" : "text-gray-400"}
          />
        </div>

        {isSelected && (
          <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
            <Check size={10} className="text-white" />
          </div>
        )}

      </div>

      {/* Text */}
      <div className="mt-3">
        <p
          className={`text-sm font-semibold ${
            isSelected ? area.text : "text-gray-900"
          }`}
        >
          {area.label}
        </p>

        <p className="text-xs text-gray-400">{area.desc}</p>
      </div>
    </button>
  );
};

export default AreaCard;