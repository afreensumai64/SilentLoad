const Field = ({ label, hint, action, children }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold tracking-wider uppercase text-gray-400">
          {label}
        </label>
        {action}
      </div>

      {children}

      {hint && <p className="text-xs text-gray-300 pl-1">{hint}</p>}
    </div>
  );
};

export default Field;