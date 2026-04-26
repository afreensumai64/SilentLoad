const DelegateModal = ({ open, onClose }) => {
  if (!open) return null;

  const options = [
    "Ask my partner",
    "Assign to a kid",
    "Hire help",
    "Let it go",
  ];

  return (
    <div className="fixed inset-0 bg-black/30 flex items-end z-50">

      <div className="bg-white w-full rounded-t-2xl p-5">

        {/* Title */}
        <h2 className="text-lg font-bold mb-2">
          Delegate this task
        </h2>

        <p className="text-sm text-gray-400 mb-4">
          Who can take this off your plate?
        </p>

        {/* Options */}
        <div className="flex flex-col gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={onClose}
              className="w-full p-3 rounded-lg border text-left text-sm bg-gray-50 hover:bg-gray-100"
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Cancel */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-3 rounded-lg border text-gray-500"
        >
          Cancel
        </button>

      </div>
    </div>
  );
};

export default DelegateModal;