import { useState } from "react";

const IconInput = ({
  id,
  type,
  placeholder,
  value,
  onChange,
  icon: Icon,
  rightEl,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <Icon
        size={16}
        className={`absolute left-3 top-1/2 -translate-y-1/2 transition ${
          focused ? "text-purple-500" : "text-gray-300"
        }`}
      />

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition ${
          focused
            ? "bg-white border border-purple-400 ring-2 ring-purple-200"
            : "bg-gray-50 border border-gray-200"
        }`}
      />

      {rightEl && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightEl}
        </div>
      )}
    </div>
  );
};

export default IconInput;